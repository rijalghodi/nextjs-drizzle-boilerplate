import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { withMiddleware } from "@/server/middleware/middleware";
import { and, asc, desc, count as drizzleCount, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { FileResponse } from "@/types/file.type";
import { User, UserRole } from "@/types/user.type";
import { generateHash } from "@/lib/bcrypt";
import {
  toBaseResponse,
  toErrorResponse,
  toPaginatedResponse,
  zodIssuesToErrorDetails,
} from "@/lib/response-helper";
import { getPresignedFileUrl } from "@/lib/s3-util";
import { UserAddSchema, UserAddSchemaType } from "@/app/forms/user-add-schema";

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  query: z.string().default(""),
  sort: z.string().default("name"),
  dir: z.enum(["asc", "desc"]).default("asc"),
  status: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
});

export const GET = withMiddleware(
  { roles: [UserRole.ADMIN] },
  async (req: NextRequest, _context: any, session: any) => {
    const raw = Object.fromEntries(req.nextUrl.searchParams);
    const params = QuerySchema.safeParse(raw);

    if (!params.success) {
      return NextResponse.json(
        toErrorResponse({
          message: "Parameter tidak valid",
          details: zodIssuesToErrorDetails(params.error.issues),
        }),
        { status: 400 }
      );
    }

    const { page, limit, query, sort: sortField, dir: sortDirection, status, role } = params.data;

    try {
      const conditions = [];
      if (role && role !== "all") conditions.push(eq(users.role, role as "admin" | "user"));
      if (status === "active") conditions.push(eq(users.isActive, true));
      else if (status === "inactive") conditions.push(eq(users.isActive, false));
      if (query)
        conditions.push(or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`)));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const sortMap: Record<string, any> = {
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        isActive: users.isActive,
      };

      const orderColumn = sortMap[sortField] || users.createdAt;
      const orderBy = sortDirection === "asc" ? asc(orderColumn) : desc(orderColumn);

      const [{ value: totalCount }] = await db
        .select({ value: drizzleCount() })
        .from(users)
        .where(whereClause);

      const userList = await db.query.users.findMany({
        where: whereClause,
        limit,
        offset: (page - 1) * limit,
        orderBy,
        with: { avatarFile: true },
        columns: {
          id: true,
          avatarFileId: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const mappedUsers = await Promise.all(
        userList.map(async (u) => {
          let avatarFile: FileResponse | null = null;
          if (u.avatarFile) {
            const fileUrl = await getPresignedFileUrl(u.avatarFile.path);
            avatarFile = {
              id: u.avatarFile.id,
              name: u.avatarFile.name || undefined,
              path: u.avatarFile.path,
              url: fileUrl,
              mimeType: u.avatarFile.mimeType || undefined,
              size: u.avatarFile.size || undefined,
              createdAt: u.avatarFile.createdAt.toISOString(),
              updatedAt: u.avatarFile.updatedAt.toISOString(),
            };
          }

          return {
            ...u,
            avatarFile: avatarFile,
          } as unknown as User;
        })
      );

      return NextResponse.json(
        toPaginatedResponse({
          data: mappedUsers,
          empty: userList.length === 0,
          pagination: {
            total: totalCount,
            page,
            from: (page - 1) * limit + 1,
            to: Math.min(page * limit, totalCount),
          },
        })
      );
    } catch {
      return NextResponse.json(
        toErrorResponse({ message: "Terjadi kesalahan. Mohon coba lagi. in a moment." }),
        { status: 500 }
      );
    }
  }
);

export const POST = withMiddleware(
  { roles: [UserRole.ADMIN] },
  async (request: NextRequest, _context: any, session: any) => {
    try {
      const body = await request.json();
      const parsedData = UserAddSchema.safeParse(body);

      if (!parsedData.success) {
        return NextResponse.json(
          toErrorResponse({ message: parsedData.error.errors[0]?.message ?? "Invalid input." }),
          { status: 400 }
        );
      }

      const { name, email, role, password }: UserAddSchemaType = parsedData.data;

      const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
      if (existingUser) {
        return NextResponse.json(toErrorResponse({ message: "Email is already registered." }), {
          status: 409,
        });
      }

      const passwordHash = await generateHash(password);
      const [user] = await db
        .insert(users)
        .values({ name, email, role: role as "admin" | "user", password: passwordHash })
        .returning();

      return NextResponse.json(
        toBaseResponse({ message: "User successfully added.", data: user }),
        {
          status: 201,
        }
      );
    } catch {
      return NextResponse.json(
        toErrorResponse({ message: "Terjadi kesalahan. Mohon coba lagi. in a moment." }),
        { status: 500 }
      );
    }
  }
);
