import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/config/env.config";
import { uid } from "./helpers";
import { getS3ClientInstance } from "./s3-client";

// Get storage configuration
function getConfig() {
  return {
    bucket: env.STORAGE_BUCKET || "shoplit",
    cdnUrl: env.STORAGE_CDN_URL?.replace(/\/$/, ""),
    endpoint: env.STORAGE_ENDPOINT?.replace(/\/$/, ""),
  };
}

export async function uploadBufferToS3({
  buffer,
  key,
  contentType,
}: {
  buffer: Buffer;
  key: string;
  contentType: string;
}): Promise<{ key: string; fileUrl: string }> {
  try {
    const config = getConfig();
    const s3Client = getS3ClientInstance();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const fileUrl = getFileUrl(key);
    return { key, fileUrl };
  } catch (error: any) {
    console.error("Upload buffer failed:", error);
    throw new Error("Failed to upload buffer to S3");
  }
}

export async function checkS3FileExists(key: string): Promise<boolean> {
  try {
    const config = getConfig();
    const s3Client = getS3ClientInstance();

    await s3Client.send(
      new HeadObjectCommand({
        Bucket: config.bucket,
        Key: key,
      })
    );
    return true;
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    console.error("Check S3 file exists failed:", error);
    return false;
  }
}

export async function uploadToS3(
  file: File,
  directory: string
): Promise<{ key: string; fileUrl: string }> {
  try {
    const config = getConfig();

    // Validate input
    if (!file) throw new Error("No file provided");
    if (!directory) throw new Error("No directory specified");

    // Generate unique filename
    const filename = `${uid()}_${file.name}`;
    const key = `${directory}/${filename}`;

    // Log upload attempt
    console.log("Uploading file:", {
      filename: file.name,
      size: file.size,
      type: file.type,
      directory,
      bucket: config.bucket,
    });

    // Upload to storage
    const s3Client = getS3ClientInstance();
    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        // CacheControl: "public, max-age=31536000",
        // ACL: "public-read",
      })
    );

    console.log("File uploaded successfully:", {
      key,
    });

    // Generate URL
    const fileUrl = await getPresignedFileUrl(key);
    console.log("File uploaded successfully:", { key, fileUrl });
    return { key, fileUrl };
  } catch (error: any) {
    // Log raw HTTP response details for debugging
    const rawResponse = error?.$response;
    if (rawResponse) {
      const bodyText = await rawResponse.body?.transformToString?.().catch(() => "(unreadable)");
      console.error("Upload failed - raw S3 response:", {
        statusCode: rawResponse.statusCode,
        headers: rawResponse.headers,
        body: bodyText,
      });
    } else {
      console.error("Upload failed:", {
        error: error instanceof Error ? error.message : String(error),
        file: file?.name,
        directory,
      });
    }
    throw new Error("Failed to upload file");
  }
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    const config = getConfig();
    if (!fileUrl) throw new Error("No file URL provided");

    // Extract key from URL
    let key = fileUrl;
    if (config.cdnUrl && fileUrl.startsWith(config.cdnUrl)) {
      key = fileUrl.replace(`${config.cdnUrl}/`, "");
    } else if (config.endpoint && fileUrl.startsWith(config.endpoint)) {
      key = fileUrl.replace(`${config.endpoint}/`, "");
    }

    // Delete from storage
    const s3Client = getS3ClientInstance();
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: key,
      })
    );

    console.log("File deleted successfully:", { key });
  } catch (error) {
    console.error("Delete failed:", {
      error: error instanceof Error ? error.message : "Unknown error",
      fileUrl,
    });
    throw new Error("Failed to delete file");
  }
}

/**
 * Generate a signed (secure/temporary) URL for a private S3 object.
 * @param key - The S3 object key (e.g. "avatars/abc123_photo.jpg")
 * @param ttlSeconds - How long the URL is valid, in seconds. Defaults to 3600 (1 hour).
 */
export async function getPresignedFileUrl(key: string, ttlSeconds: number = 3600): Promise<string> {
  const config = getConfig();

  const client = getS3ClientInstance();

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  return getSignedUrl(client as any, command as any, { expiresIn: ttlSeconds });
}

export function getFileUrl(key: string): string {
  const config = getConfig();

  // Prefer CDN URL if available
  if (config.cdnUrl) {
    return `${config.cdnUrl}/${key}`;
  }

  // Fallback to direct endpoint
  return `${config.endpoint}/${key}`;
}
