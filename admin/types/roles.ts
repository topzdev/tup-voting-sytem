export enum UserRole {
  SUPER_ADMIN = "sadmin",
  ADMIN = "admin",
}

export type RolesString = keyof typeof UserRole;

export type UserRolesValue = "sadmin" | "admin";
