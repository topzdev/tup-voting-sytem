import { User } from "./entity/user.entity";

export enum UserRole {
  SUPER_ADMIN = "sadmin",
  ADMIN = "admin",
}

export interface GetUserQuery {
  search?: string;
  order?: any;
  page: number;
  take: number;
}

export type CreateUser = Pick<
  User,
  "firstname" | "lastname" | "username" | "password" | "email_address"
> & {
  role: UserRole;
};

export type UpdateUser = Pick<
  User,
  "id" | "firstname" | "lastname" | "email_address" | "username"
> & {
  role: UserRole;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
