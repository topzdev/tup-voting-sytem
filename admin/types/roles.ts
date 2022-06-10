export enum UserRole {
  SUPER_ADMIN = "sadmin",
  ADMIN = "admin",
  ELECTION_OFFICER = "elec_ofc",
}

export type RolesString = keyof typeof UserRole;

export type UserRolesValue = "sadmin" | "admin" | "elec_ofc";
