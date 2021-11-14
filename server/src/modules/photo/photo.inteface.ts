import { UserRole } from "./entity/photo.entity";

export interface GetUserQuery {
  search?: string;
  order?: any;
  page: number;
  take: number;
}

export interface CreateUser {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UpdateUser {
  id: number;
  firstname: string;
  lastname: string;
  role: UserRole;
}
