import type { LucideIcon } from "lucide-react";
import { Users } from "lucide-react";
import { ROUTES } from "./routes.config";

type MenuConfig = Array<
  | {
      title: string;
      icon: LucideIcon;
      path: string;
    }
  | { heading: string; hidden?: boolean }
>;

export const MENU_SIDEBAR_SUPERADMIN: MenuConfig = [
  { heading: "Manajemen", hidden: true },
  {
    title: "Pengguna",
    icon: Users,
    path: ROUTES.USERS,
  },
];

export const MENU_SIDEBAR_ADMIN: MenuConfig = [
  { heading: "Manajemen", hidden: true },
  {
    title: "Pengguna",
    icon: Users,
    path: ROUTES.USERS,
  },
];

export const MENU_SIDEBAR_STAFF: MenuConfig = [];

export const MENU_SIDEBAR_GUEST: MenuConfig = [];
