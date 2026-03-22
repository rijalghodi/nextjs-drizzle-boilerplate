import { z } from "zod";

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi." })
    .email({ message: "Email tidak valid." }),
});

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
