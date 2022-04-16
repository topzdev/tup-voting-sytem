import apiClient from ".";
import transformParamsToUrl from "@/helpers/paramsToUrl.helpers";

const url = "/api/v1/user";

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email_address: string;
  disabled: boolean;
  role: string;
};

export interface GetUsersDto {
  search?: string;
  order?: any;
  page?: number;
  take?: number;
  perPage?: number;
}

export enum UserRole {
  SUPER_ADMIN = "sadmin",
  ADMIN = "admin",
}

export type CreateUserDto = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email_address: string;
  role: UserRole;
};

export type UpdateUserDto = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email_address: string;
};

export type ChangePasswordDto = {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type DisableUserDto = {
  id: number;
  disabled: boolean;
};

export type ChangeRoleDto = Pick<User, "role" | "id">;

const userServices = {
  async getAll(query: GetUsersDto) {
    return (await apiClient.get(`${url}/all/${transformParamsToUrl(query)}`))
      .data;
  },
  async getById(id: User["id"]) {
    return (await apiClient.get(`${url}/one/${id}`)).data;
  },

  async create(body: CreateUserDto) {
    return (await apiClient.post(`${url}`, body)).data;
  },

  async update(body: UpdateUserDto) {
    return (await apiClient.put(`${url}`, body)).data;
  },

  async changePassword(body: ChangePasswordDto) {
    return (await apiClient.put(`${url}/change-password`, body)).data;
  },

  async resetPassword(id: User["id"]) {
    return (await apiClient.put(`${url}/reset-password/${id}`)).data;
  },

  async archive(id: User["id"]) {
    return (await apiClient.put(`${url}/archive/${id}`)).data;
  },

  async unarchive(id: User["id"]) {
    return (await apiClient.put(`${url}/${id}`)).data;
  },

  async restore(id: User["id"]) {
    return (await apiClient.put(`${url}/restore/${id}`)).data;
  },

  async delete(id: User["id"]) {
    return (await apiClient.delete(`${url}/${id}`)).data;
  },

  async disableUser(dto: DisableUserDto) {
    return await apiClient.put(`${url}/disable-user`, dto);
  },
  async changeRole(dto: ChangeRoleDto) {
    return await apiClient.put(`${url}/disable-user`, dto);
  },
};

export default userServices;
