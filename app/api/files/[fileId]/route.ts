import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema";
import { withMiddleware } from "@/server/middleware/middleware";
import { eq } from "drizzle-orm";
import { FileResponse } from "@/types/file.type";
import { toBaseResponse, toErrorResponse } from "@/lib/response-helper";
import { getPresignedFileUrl } from "@/lib/s3-util";

type Params = { params: Promise<{ fileId: string }> };

export const GET = withMiddleware(
  { authenticated: true },
  async (_req: NextRequest, { params }: Params) => {
    const { fileId } = await params;

    try {
      const file = await db.query.files.findFirst({
        where: eq(files.id, fileId),
      });

      if (!file) {
        return NextResponse.json(toErrorResponse({ message: "File tidak ditemukan." }), {
          status: 404,
        });
      }

      const fileUrl = await getPresignedFileUrl(file.path);

      const mappedFile: FileResponse = {
        id: file.id,
        name: file.name || undefined,
        path: file.path,
        url: fileUrl,
        mimeType: file.mimeType || undefined,
        size: file.size || undefined,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
      };

      return NextResponse.json(toBaseResponse({ data: mappedFile }));
    } catch (error: any) {
      console.error("Fetch file error:", error);
      return NextResponse.json(
        toErrorResponse({ message: "Terjadi kesalahan. Mohon coba lagi. in a moment." }),
        { status: 500 }
      );
    }
  }
);
