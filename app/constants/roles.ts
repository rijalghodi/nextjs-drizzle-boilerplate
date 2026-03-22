import { UserRole } from "@/types/user.type";
import { BadgeVariant } from "@/components/ui/badge";

// Default status mapping
export const UserRoleProps: Record<UserRole, { label: string; variant: BadgeVariant }> = {
  [UserRole.ADMIN]: {
    label: "Admin",
    variant: "success",
  },
  [UserRole.USER]: {
    label: "User",
    variant: "info",
  },
} as const;

// Function to get status properties
export const getUserRoleProps = (role: UserRole): { label: string; variant: BadgeVariant } => {
  return UserRoleProps[role] || { label: "Unknown", variant: "success" };
};

export const roleList: { value: UserRole; label: string; variant: BadgeVariant }[] = [
  {
    value: UserRole.ADMIN,
    label: "Admin",
    variant: "success",
  },
  {
    value: UserRole.USER,
    label: "User",
    variant: "info",
  },
] as const;
