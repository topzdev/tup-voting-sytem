import { User } from "./entity/user.entity";

export enum UserRole {
  SUPER_ADMIN = "sadmin",
  ADMIN = "admin",
  WATCHER = "watcher",
  DEV = "dev",
}

export interface GetUserQuery {
  search?: string;
  order?: any;
  page: number;
  take: number;
}

export type CreateUser = Pick<
  User,
  "firstname" | "lastname" | "username" | "password"
> & {
  role: UserRole;
};

export type UpdateUser = Pick<User, "id" | "firstname" | "lastname"> & {
  role: UserRole;
};
