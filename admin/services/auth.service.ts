import apiClient from ".";
import { AdminUser } from "../types/user";

const url = "/api/v1/auth";

export type UserRoles = "sadmin" | "admin" | undefined;

export interface SystemLoginCredentials {
  usernameOrEmail?: string;
  password?: string;
  allowedRole?: UserRoles;
}

export type SystemLoginReturn = {
  token: string;
  user: AdminUser;
  expiresIn: string;
};

const authServices = {
  async systemLogin(
    crendentials: SystemLoginCredentials
  ): Promise<SystemLoginReturn> {
    return (await apiClient.post(`${url}/system/login`, crendentials)).data;
  },
};

export default authServices;
