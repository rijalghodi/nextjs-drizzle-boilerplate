import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { withMiddleware } from "@/server/middleware/middleware";
import { eq } from "drizzle-orm";
import { User, UserRole } from "@/types/user.type";
import { generateHash } from "@/lib/bcrypt";
import { toBaseResponse, toErrorResponse } from "@/lib/response-helper";
import { getPresignedFileUrl } from "@/lib/s3-util";
import { ediCurrenttUserSchema } from "@/app/forms/edit-current-user-schema";

export const GET = withMiddleware(
  { authenticated: true },
  async (_req: NextRequest, _context: any, session) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, session!.user!.id),
        with: { avatarFile: true },
        columns: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          emailVerifiedAt: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return NextResponse.json(toErrorResponse({ message: "Pengguna tidak ditemukan" }), {
          status: 404,
        });
      }

      let avatarFileUrl: string | undefined;
      if (user.avatarFile) {
        avatarFileUrl = await getPresignedFileUrl(user.avatarFile.path);
      }

      const responseData: User = {
        id: user.id,
        name: user.name ?? undefined,
        email: user.email,
        isActive: user.isActive ?? undefined,
        emailVerifiedAt: user.emailVerifiedAt ?? null,
        role: user.role as UserRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        avatarFile: user.avatarFile
          ? {
              id: user.avatarFile.id,
              name: user.avatarFile.name ?? undefined,
              path: user.avatarFile.path,
              url: avatarFileUrl ?? "",
              size: user.avatarFile.size ?? undefined,
              mimeType: user.avatarFile.mimeType ?? undefined,
            }
          : null,
        avatarFileId: user.avatarFile?.id ?? null,
      };

      return NextResponse.json(
        toBaseResponse({
          data: responseData,
          message: "Berhasil mengambil data user",
        })
      );
    } catch (error: any) {
      return NextResponse.json(toErrorResponse({ message: error.message }), { status: 500 });
    }
  }
);

export const PUT = withMiddleware(
  { authenticated: true },
  async (request: NextRequest, _context: any, session) => {
    try {
      const body = await request.json();
      const parsedData = ediCurrenttUserSchema.safeParse(body);

      if (!parsedData.success) {
        return NextResponse.json(
          toErrorResponse({ message: parsedData.error.errors[0]?.message ?? "Invalid input" }),
          { status: 400 }
        );
      }

      const { name, avatarFileId, password } = parsedData.data;

      const dataToUpdate: any = { name };
      if (avatarFileId) {
        dataToUpdate.avatarFileId = avatarFileId;
      }

      if (password && password.trim() !== "") {
        const passwordHash = await generateHash(password);
        dataToUpdate.password = passwordHash;
      }

      await db.update(users).set(dataToUpdate).where(eq(users.id, session!.user!.id));

      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, session!.user!.id),
        with: { avatarFile: true },
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return NextResponse.json(
        toBaseResponse({ message: "Profil berhasil diperbarui", data: updatedUser })
      );
    } catch (error: any) {
      return NextResponse.json(toErrorResponse({ message: error.message }), { status: 500 });
    }
  }
);
