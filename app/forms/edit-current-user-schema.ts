import { z } from "zod";
import { getPasswordSchema } from "@/lib/zod-schema";

export const ediCurrenttUserSchema = z
  .object({
    name: z.string().nonempty({ message: "Wajib diisi." }),
    avatarFileId: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password.trim() !== "") {
      const passwordResult = getPasswordSchema().safeParse(data.password);
      if (!passwordResult.success) {
        passwordResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            path: ["password"],
            message: issue.message,
            code: z.ZodIssueCode.custom,
          });
        });
      }
    }
  });

export type EditCurrentUserSchemaType = z.infer<typeof ediCurrenttUserSchema>;
