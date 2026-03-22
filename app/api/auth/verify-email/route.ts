import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  // First, retrieve the verification token.
  const verificationToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  try {
    // Use a transaction so that the user update and token deletion occur together.
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ isActive: true, emailVerifiedAt: new Date() })
        .where(eq(users.id, verificationToken.identifier));

      await tx.delete(verificationTokens).where(eq(verificationTokens.token, token));
    });

    return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
