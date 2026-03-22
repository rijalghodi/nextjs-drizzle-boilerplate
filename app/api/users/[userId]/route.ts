import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { files, users } from "@/db/schema";
import { withMiddleware } from "@/server/middleware/middleware";
import { UserRole } from "@/types";
import { eq } from "drizzle-orm";
import { FileResponse } from "@/types/file.type";
import { User } from "@/types/user.type";
import { toBaseResponse, toErrorResponse } from "@/lib/response-helper";
import { getFileUrl } from "@/lib/s3-util";
import { UserEditSchema, UserEditSchemaType } from "@/app/forms/user-edit-schema";

type Params = { params: Promise<{ userId: string }> };

// ─── GET /api/users/[userId] ────────────────────────────────────────────────

export const GET = withMiddleware(
  { roles: [UserRole.ADMIN] },
  async (_req: NextRequest, { params }: Params) => {
    const { userId } = await params;

    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: { avatarFile: true },
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          emailVerifiedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return NextResponse.json(toErrorResponse({ message: "Pengguna tidak ditemukan." }), {
          status: 404,
        });
      }

      let mappedAvatar: FileResponse | undefined = undefined;
      if (user.avatarFile) {
        mappedAvatar = {
          id: user.avatarFile.id,
          name: user.avatarFile.name || undefined,
          path: user.avatarFile.path,
          url: getFileUrl(user.avatarFile.path),
          mimeType: user.avatarFile.mimeType || undefined,
          size: user.avatarFile.size || undefined,
          createdAt: user.avatarFile.createdAt.toISOString(),
          updatedAt: user.avatarFile.updatedAt.toISOString(),
        };
      }

      const mappedUser = {
        ...user,
        avatar: mappedAvatar,
      } as unknown as User;

      return NextResponse.json(toBaseResponse({ data: mappedUser }));
    } catch {
      return NextResponse.json(
        toErrorResponse({ message: "Terjadi kesalahan. Mohon coba lagi. in a moment." }),
        { status: 500 }
      );
    }
  }
);

// ─── PUT /api/users/[userId] ──────────────────────────────────────────────

export const PUT = withMiddleware(
  { roles: [UserRole.ADMIN] },
  async (request: NextRequest, { params }: Params) => {
    const { userId } = await params;

    try {
      const body = await request.json();

      // ── Toggle active status ──────────────────────────────────────────────
      if (Object.keys(body).length === 1 && typeof body.isActive === "boolean") {
        const existing = await db.query.users.findFirst({ where: eq(users.id, userId) });
        if (!existing) {
          return NextResponse.json(toErrorResponse({ message: "Pengguna tidak ditemukan." }), {
            status: 404,
          });
        }

        await db.update(users).set({ isActive: body.isActive }).where(eq(users.id, userId));

        const updated = await db.query.users.findFirst({
          where: eq(users.id, userId),
          with: { avatarFile: true },
          columns: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            updatedAt: true,
          },
        });

        if (!updated) throw new Error("Update failed");

        let mappedAvatar: FileResponse | undefined = undefined;
        if (updated.avatarFile) {
          mappedAvatar = {
            id: updated.avatarFile.id,
            name: updated.avatarFile.name || undefined,
            path: updated.avatarFile.path,
            url: getFileUrl(updated.avatarFile.path),
            mimeType: updated.avatarFile.mimeType || undefined,
            size: updated.avatarFile.size || undefined,
            createdAt: updated.avatarFile.createdAt.toISOString(),
            updatedAt: updated.avatarFile.updatedAt.toISOString(),
          };
        }

        const mappedUpdated = {
          ...updated,
          avatar: mappedAvatar,
        } as unknown as User;

        return NextResponse.json(
          toBaseResponse({
            message: `User ${updated.isActive ? "activated" : "deactivated"} successfully.`,
            data: mappedUpdated,
          })
        );
      }

      // ── Edit user details ─────────────────────────────────────────────────
      const parsedData = UserEditSchema.safeParse(body);
      if (!parsedData.success) {
        return NextResponse.json(
          toErrorResponse({ message: parsedData.error.errors[0]?.message ?? "Invalid input." }),
          { status: 400 }
        );
      }

      const { name, email, role, avatarFileId }: UserEditSchemaType = parsedData.data;

      const existing = await db.query.users.findFirst({ where: eq(users.id, userId) });
      if (!existing) {
        return NextResponse.json(toErrorResponse({ message: "Pengguna tidak ditemukan." }), {
          status: 404,
        });
      }

      if (email !== existing.email) {
        const emailTaken = await db.query.users.findFirst({ where: eq(users.email, email) });
        if (emailTaken) {
          return NextResponse.json(
            toErrorResponse({ message: "Email is already registered to another account." }),
            { status: 409 }
          );
        }
      }

      if (avatarFileId) {
        const file = await db.query.files.findFirst({ where: eq(files.id, avatarFileId) });
        if (!file) {
          return NextResponse.json(toErrorResponse({ message: "File tidak ditemukan." }), {
            status: 404,
          });
        }
      }

      await db
        .update(users)
        .set({ name, email, role: role as UserRole, avatarFileId })
        .where(eq(users.id, userId));

      const updated = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: { avatarFile: true },
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          updatedAt: true,
        },
      });

      if (!updated) throw new Error("Update failed");

      let mappedAvatar: FileResponse | undefined = undefined;
      if (updated.avatarFile) {
        mappedAvatar = {
          id: updated.avatarFile.id,
          name: updated.avatarFile.name || undefined,
          path: updated.avatarFile.path,
          url: getFileUrl(updated.avatarFile.path),
          mimeType: updated.avatarFile.mimeType || undefined,
          size: updated.avatarFile.size || undefined,
          createdAt: updated.avatarFile.createdAt.toISOString(),
          updatedAt: updated.avatarFile.updatedAt.toISOString(),
        };
      }

      const mappedUpdated = {
        ...updated,
        avatar: mappedAvatar,
      } as unknown as User;

      return NextResponse.json(
        toBaseResponse({ message: "User updated successfully.", data: mappedUpdated })
      );
    } catch {
      return NextResponse.json(
        toErrorResponse({ message: "Terjadi kesalahan. Mohon coba lagi. in a moment." }),
        { status: 500 }
      );
    }
  }
);

// ─── DELETE /api/users/[userId] ─────────────────────────────────────────────

export const DELETE = withMiddleware(
  { roles: [UserRole.ADMIN] },
  async (_req: NextRequest, { params }: Params, session) => {
    const { userId } = await params;

    try {
      const existing = await db.query.users.findFirst({ where: eq(users.id, userId) });
      if (!existing) {
        return NextResponse.json(toErrorResponse({ message: "Pengguna tidak ditemukan." }), {
          status: 404,
        });
      }

      if (existing.email === session!.user?.email) {
        return NextResponse.json(
          toErrorResponse({ message: "You cannot delete your own account." }),
          { status: 403 }
        );
      }

      await db.delete(users).where(eq(users.id, userId));

      return NextResponse.json(toBaseResponse({ message: "User deleted successfully." }));
    } catch {
      return NextResponse.json(
        toErrorResponse({ message: "Terjadi kesalahan. Mohon coba lagi. in a moment." }),
        { status: 500 }
      );
    }
  }
);
