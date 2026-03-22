import { UserRole } from "@/types";
import { z } from "zod";
import { getPasswordSchema } from "@/lib/zod-schema";
import { roleList } from "../constants/roles";

export const UserAddSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Wajib diisi." })
    .max(50, { message: "Panjang maksimal 50 karakter." }),
  email: z.string().email({
    message: "Email tidak valid.",
  }),
  role: z.enum(roleList.map((t) => t.value) as [UserRole, ...UserRole[]]),
  password: getPasswordSchema(),
  avatarFileId: z.string().optional(),
});

export type UserAddSchemaType = z.infer<typeof UserAddSchema>;
