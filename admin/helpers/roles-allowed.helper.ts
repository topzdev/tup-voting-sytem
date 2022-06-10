import { RolesString, UserRole, UserRolesValue } from "../types/roles";

export const rolesOnlyAllowed = (
  userRole: UserRolesValue,
  rolesAllowed: UserRolesValue[]
) => {
  return rolesAllowed.findIndex((item) => {
    return item === userRole;
  }) !== -1
    ? true
    : false;
};
