import "next-auth";
import "next-auth/jwt";
import { UserRole } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    role: UserRole;
  }
}
