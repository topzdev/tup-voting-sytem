import apiClient from ".";
import { AdminUser } from "../types/user";

const url = "/api/v1/auth";

export type UserRoles = "sadmin" | "admin" | undefined;

export interface SystemLoginCredentials {
  usernameOrEmail?: string;
  password?: string;
  allowedRole?: UserRoles;
}

export type AdminLoginCredentials = {
  usernameOrEmail: string;
  password: string;
  token: string;
};

export type SystemLoginReturn = {
  token: string;
  user: AdminUser;
  expiresIn: string;
};

export type ResendAdminLoginOTP = {
  user_id: AdminUser["id"];
};

export type AdminLoginReturn = {
  last_resend_otp_time: AdminUser["last_resend_otp_time"];
  otp_resend_interval: number;
  user: Pick<AdminUser, "id" | "email_address" | "firstname" | "lastname">;
};

const authServices = {
  async systemLogin(
    crendentials: SystemLoginCredentials
  ): Promise<SystemLoginReturn> {
    return (await apiClient.post(`${url}/system/login`, crendentials)).data;
  },

  async adminLogin(
    crendentials: AdminLoginCredentials
  ): Promise<AdminLoginReturn> {
    return (await apiClient.post(`${url}/admin/login`, crendentials)).data;
  },

  async resendAdminLoginOTP(
    dto: ResendAdminLoginOTP
  ): Promise<AdminLoginReturn> {
    return (await apiClient.post(`${url}/admin/login`, dto)).data;
  },
};

export default authServices;
