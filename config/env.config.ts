import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { booleanSchema } from "../lib/zod-schema";

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string().nonempty().default("super_secret_key"),
    NEXTAUTH_URL: z.string().optional().default("http://localhost:3000"),

    // Database
    DB_PROTOCOL: z.string().nonempty().default("postgresql"),
    DB_HOST: z.string().nonempty().default("localhost"),
    DB_PORT: z.coerce.number().default(5432),
    DB_DATABASE: z.string().nonempty().default("rsi"),
    DB_USERNAME: z.string().nonempty().default("postgres"),
    DB_PASSWORD: z.string().nonempty().default("postgres"),

    // Object Storage
    STORAGE_ACCESS_KEY: z.string().optional(),
    STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
    STORAGE_REGION: z.string().optional(),
    STORAGE_BUCKET: z.string().optional(),
    STORAGE_ENDPOINT: z.string().optional(),
    STORAGE_CDN_URL: z.string().optional(),
    STORAGE_FORCE_PATH_STYLE: booleanSchema().optional(),

    // SMTP
    SMTP_HOST: z.string().nonempty().default("smtp.gmail.com"),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_SECURE: booleanSchema().optional(),
    SMTP_USER: z.string().email().default("no-reply@rsi.com"),
    SMTP_PASS: z.string().nonempty().default("rsi_accounting"),
    SMTP_SENDER: z.string().nonempty().default("RSI Accounting"),
    SMTP_FROM: z.string().email().default("no-reply@rsi.com"),
  },
  client: {
    NEXT_PUBLIC_IMAGE: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().optional(),
  },
  runtimeEnv: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DB_PROTOCOL: process.env.DB_PROTOCOL,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY,
    STORAGE_SECRET_ACCESS_KEY: process.env.STORAGE_SECRET_ACCESS_KEY,
    STORAGE_REGION: process.env.STORAGE_REGION,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    STORAGE_CDN_URL: process.env.STORAGE_CDN_URL,
    STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
    STORAGE_FORCE_PATH_STYLE: process.env.STORAGE_FORCE_PATH_STYLE,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SENDER: process.env.SMTP_SENDER,
    SMTP_FROM: process.env.SMTP_FROM,
    NEXT_PUBLIC_IMAGE: process.env.NEXT_PUBLIC_IMAGE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
