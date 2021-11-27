import axios from "../../configs/axios";
import { AdminLoginCredentials } from "../../type/global";

export enum UserRole {
  SUPER_ADMIN = "sadmin",
  ADMIN = "admin",
  WATCHER = "watcher",
  DEV = "dev",
}

export type UserRoleStrings = keyof typeof UserRole;

export type AdminUser = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: UserRole;
};

const login = async (credentials: AdminLoginCredentials) => {
  const response = await axios.post(`api/v1/auth/admin/login`, credentials);
  return response;
};

const logout = async () => {
  const response = await axios.post(`api/v1/auth/admin/logout`);

  return response;
};

const me = async (accessToken: string) => {
  const response = await axios.get("api/v1/auth/admin/me", {
    headers: {
      Authorization: accessToken,
    },
  });

  return response;
};

const adminAuthApi = {
  login,
  logout,
  me,
};

export default adminAuthApi;
