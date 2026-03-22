export type RouteConfig = {
  path: string;
  label: string;
  children?: Record<string, RouteConfig>;
};

export const ROUTES = {
  // Auth
  LOGIN: "/signin",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",

  // App
  DASHBOARD: "/",
  ME: "/me",
  USERS: "/users",
};
