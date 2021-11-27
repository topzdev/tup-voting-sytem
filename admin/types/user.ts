import { UserRole } from "./roles";

export type AdminUser = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: UserRole;
};
