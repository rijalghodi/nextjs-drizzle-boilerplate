import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/config/env.config";

// Create a function to get the S3 client
function getS3Client() {
  // Check for required environment variables
  const config = {
    region: env.STORAGE_REGION,
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
    endpoint: env.STORAGE_ENDPOINT,
  };

  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId!,
      secretAccessKey: config.secretAccessKey!,
    },
    forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
  });
}

// Export a lazy-loaded client
let s3ClientInstance: S3Client | null = null;

export function getS3ClientInstance(): S3Client {
  if (!s3ClientInstance) {
    try {
      s3ClientInstance = getS3Client();
    } catch (error) {
      console.error("Failed to initialize S3 client:", error);
      throw error;
    }
  }
  return s3ClientInstance;
}
