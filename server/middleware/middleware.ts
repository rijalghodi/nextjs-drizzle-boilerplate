import { NextRequest, NextResponse } from "next/server";
import { AppError, UserRole } from "@/types";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import {
  FORBIDDEN_MESSAGE,
  toErrorResponse,
  UNAUTHORIZED_MESSAGE,
  zodIssuesToErrorDetails,
} from "@/lib/response-helper";
import authOptions from "@/app/api/auth/[...nextauth]/auth-options";

type RouteHandler = (
  req: NextRequest,
  context: any,
  session: Session | null
) => Promise<NextResponse> | NextResponse;

type MiddlewareOptions = {
  authenticated?: boolean;
  roles?: UserRole[];
};

export function withMiddleware(options: MiddlewareOptions, handler: RouteHandler) {
  return async (req: NextRequest, context: any) => {
    try {
      const session = await getServerSession(authOptions);
      if (options.authenticated) {
        if (!session) {
          return NextResponse.json(toErrorResponse({ message: UNAUTHORIZED_MESSAGE }), {
            status: 401,
          });
        }
      }

      if (options.roles) {
        if (!session) {
          return NextResponse.json(toErrorResponse({ message: UNAUTHORIZED_MESSAGE }), {
            status: 401,
          });
        }

        if (!session.user || !options.roles.includes(session.user.role)) {
          return NextResponse.json(toErrorResponse({ message: FORBIDDEN_MESSAGE }), {
            status: 403,
          });
        }
      }
      return handler(req, context, session);
    } catch (error) {
      return handleError(error);
    }
  };
}

export const handleError = (error: any): NextResponse => {
  if (error instanceof AppError) {
    return NextResponse.json(toErrorResponse(error), { status: error.code || 500 });
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      toErrorResponse(
        new AppError({
          message: error.message,
          code: 400,
          details: zodIssuesToErrorDetails(error.issues),
        })
      ),
      { status: 400 }
    );
  }

  return NextResponse.json(toErrorResponse(new AppError({ message: error.message, code: 422 })), {
    status: 422,
  });
};
