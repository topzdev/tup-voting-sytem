export enum UserRole {
  SUPER_ADMIN = "sadmin",
  ADMIN = "admin",
  WATCHER = "watcher",
  DEV = "dev",
}

export type RolesString = keyof typeof UserRole;
