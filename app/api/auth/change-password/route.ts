import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateHash } from "@/lib/bcrypt";
import { toBaseResponse, toErrorResponse } from "@/lib/response-helper";
import { sendEmail } from "@/lib/send-email";
import { ChangePasswordApiSchema } from "@/app/(auth)/forms/change-password-schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChangePasswordApiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        toErrorResponse({ message: parsed.error.errors[0]?.message ?? "Invalid input." }),
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;

    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });
    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(toErrorResponse({ message: "Invalid or expired token." }), {
        status: 400,
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, verificationToken.identifier),
    });
    if (!user) {
      return NextResponse.json(toErrorResponse({ message: "Pengguna tidak ditemukan." }), {
        status: 404,
      });
    }

    const hashedPassword = await generateHash(newPassword);

    // Update password and delete token atomically
    await db.transaction(async (tx) => {
      await tx.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));
      await tx.delete(verificationTokens).where(eq(verificationTokens.token, token));
    });

    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      content: {
        title: `Hello, ${user.name}`,
        subtitle: "Your password has been successfully updated.",
      },
    });

    return NextResponse.json(toBaseResponse({ message: "Password reset successful." }), {
      status: 200,
    });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(toErrorResponse({ message: "Password reset failed." }), {
      status: 500,
    });
  }
}
