import { z } from "zod";

export const SigninSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi." })
    .email({ message: "Email tidak valid." }),
  password: z.string().min(1, { message: "Password wajib diisi." }),
  rememberMe: z.boolean().optional(),
});

export type SigninSchemaType = z.infer<typeof SigninSchema>;
