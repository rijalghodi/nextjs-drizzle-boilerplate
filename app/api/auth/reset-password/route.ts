import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toBaseResponse, toErrorResponse } from "@/lib/response-helper";
import { sendEmail } from "@/lib/send-email";
import { ResetPasswordSchema } from "@/app/(auth)/forms/reset-password-schema";

export async function POST(req: NextRequest) {
  try {
    // Validate body
    const body = await req.json();
    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        toErrorResponse({ message: parsed.error.errors[0]?.message ?? "Invalid input." }),
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const user = await db.query.users.findFirst({ where: eq(users.email, email) });

    // Always return the same message to avoid email enumeration
    const successMessage =
      "If an account with that email exists, a password reset link has been sent.";

    if (!user) {
      return NextResponse.json(toBaseResponse({ message: successMessage }), { status: 200 });
    }

    // Generate token and store with 1-hour expiry
    const token = crypto.randomBytes(32).toString("hex");
    await db.insert(verificationTokens).values({
      identifier: user.id,
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/change-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      content: {
        title: `Hello, ${user.name}`,
        subtitle: "You requested a password reset. Click the link below to reset your password.",
        buttonLabel: "Reset Password",
        buttonUrl: resetUrl,
        description:
          "This link is valid for 1 hour. If you did not request this email, you can safely ignore it.",
      },
    });

    return NextResponse.json(toBaseResponse({ message: successMessage }), { status: 200 });
  } catch (err) {
    console.error("Password reset error:", err);
    return NextResponse.json(toErrorResponse({ message: "Failed to process request." }), {
      status: 500,
    });
  }
}
