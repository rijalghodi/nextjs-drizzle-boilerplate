"use client";

import { UserRole } from "@/types";
import { useSession } from "next-auth/react";

export function useHasRole(allowedRoles: UserRole[]) {
  const session = useSession();
  const role = session?.data?.user?.role;
  if (!role) return false;
  return allowedRoles.includes(role as UserRole);
}

export function useHasAuth() {
  const session = useSession();
  return !!session?.data?.user?.role;
}
