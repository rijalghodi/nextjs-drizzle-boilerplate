import type { NextConfig } from "next";

const envImages = process.env.NEXT_PUBLIC_IMAGE || "";
const urls = envImages.split(",");

const remotePatterns = urls
  .filter((url) => url.trim())
  .map((url) => {
    const parsed = new URL(url.trim());
    return {
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      protocol: parsed.protocol.replace(":", "") as "http" | "https" | undefined,
      pathname: parsed.pathname,
    };
  })
  .filter((pattern) => pattern);

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    remotePatterns,
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production",
  // },
};

export default nextConfig;
