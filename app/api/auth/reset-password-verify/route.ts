import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toBaseResponse, toErrorResponse } from "@/lib/response-helper";

const VerifyTokenSchema = z.object({
  token: z.string().min(1, { message: "Token is required." }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyTokenSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        toErrorResponse({ message: parsed.error.errors[0]?.message ?? "Invalid input." }),
        { status: 400 }
      );
    }

    const { token } = parsed.data;

    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(toErrorResponse({ message: "Invalid or expired token." }), {
        status: 400,
      });
    }

    return NextResponse.json(toBaseResponse({ message: "Token is valid." }), { status: 200 });
  } catch (err) {
    console.error("Token verification error:", err);
    return NextResponse.json(toErrorResponse({ message: "Token verification failed." }), {
      status: 500,
    });
  }
}
