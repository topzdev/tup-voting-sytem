import { RolesString, UserRole, UserRolesValue } from "../types/roles";

export const rolesOnlyAllowed = (
  userRole: UserRolesValue,
  rolesAllowed: RolesString[]
) => {
  return rolesAllowed.findIndex((item: RolesString) => {
    return UserRole[item] === userRole;
  }) !== -1
    ? true
    : false;
};
