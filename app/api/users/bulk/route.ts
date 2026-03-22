import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { withMiddleware } from "@/server/middleware/middleware";
import { UserRole } from "@/types";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { toBaseResponse, toErrorResponse } from "@/lib/response-helper";

const BulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required."),
});

// ─── DELETE /api/users/bulk ─────────────────────────────────────────────────

export const DELETE = withMiddleware(
  { roles: [UserRole.ADMIN] },
  async (request: NextRequest, _context: any, session: any) => {
    try {
      const body = await request.json();
      const parsedData = BulkDeleteSchema.safeParse(body);

      if (!parsedData.success) {
        return NextResponse.json(
          toErrorResponse({ message: parsedData.error.errors[0]?.message ?? "Invalid input." }),
          { status: 400 }
        );
      }

      const { ids } = parsedData.data;

      // Prevent self-deletion
      const selfUser = session?.user?.email
        ? await db.query.users.findFirst({ where: eq(users.email, session.user.email) })
        : null;
      const safeIds = selfUser ? ids.filter((id) => id !== selfUser.id) : ids;

      const deleted = await db.delete(users).where(inArray(users.id, safeIds)).returning();
      const count = deleted.length;

      return NextResponse.json(
        toBaseResponse({ message: `${count} user(s) deleted successfully.` })
      );
    } catch {
      return NextResponse.json(
        toErrorResponse({ message: "Terjadi kesalahan. Mohon coba lagi. in a moment." }),
        { status: 500 }
      );
    }
  }
);
