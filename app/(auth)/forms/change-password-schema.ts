import { z } from "zod";
import { getPasswordSchema } from "@/lib/zod-schema";

export const ChangePasswordSchema = z
  .object({
    newPassword: getPasswordSchema(),
    confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;

export const ChangePasswordApiSchema = z.object({
  token: z.string().min(1, { message: "A valid token is required to change the password." }),
  newPassword: getPasswordSchema(),
});

export type ChangePasswordApiSchemaType = z.infer<typeof ChangePasswordApiSchema>;
