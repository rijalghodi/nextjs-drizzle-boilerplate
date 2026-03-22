import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema";
import { withMiddleware } from "@/server/middleware/middleware";
import { FileResponse } from "@/types/file.type";
import { toBaseResponse, toErrorResponse } from "@/lib/response-helper";
import { uploadToS3 } from "@/lib/s3-util";

export const POST = withMiddleware(
  { authenticated: true },
  async (request: NextRequest, _context, session) => {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const directory = (formData.get("directory") as string) || "uploads";

      if (!file) {
        return NextResponse.json(toErrorResponse({ message: "No file provided" }), { status: 400 });
      }

      // Upload to S3
      const { key, fileUrl } = await uploadToS3(file, directory);

      // Save to database
      const [newFile] = await db
        .insert(files)
        .values({
          name: file.name,
          path: key,
          mimeType: file.type,
          size: file.size,
        })
        .returning();

      // Format response
      const responseData: FileResponse = {
        id: newFile.id,
        name: newFile.name || undefined,
        path: newFile.path,
        url: fileUrl,
        mimeType: newFile.mimeType || undefined,
        size: newFile.size || undefined,
        createdAt: newFile.createdAt.toISOString(),
        updatedAt: newFile.updatedAt.toISOString(),
      };

      return NextResponse.json(
        toBaseResponse({
          message: "File uploaded successfully",
          data: responseData,
        }),
        { status: 201 }
      );
    } catch (error: any) {
      console.error("File upload error:", error);
      return NextResponse.json(
        toErrorResponse({ message: error.message || "Something went wrong" }),
        { status: 500 }
      );
    }
  }
);
