import { FileResponse } from "./file.type";

// Enums
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// Models
export type User = {
  id: string;
  email: string;
  emailVerifiedAt?: Date | null;
  name?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  avatarFile?: FileResponse | null;
  avatarFileId?: string | null;
};
