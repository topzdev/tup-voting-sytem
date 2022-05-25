import { Organization } from "../organization/entity/organization.entity";
import { User } from "../user/entity/user.entity";
import { UserRole } from "../user/user.inteface";

export interface GetElectionOfficerQuery {
  search?: string;
  order?: any;
  page: number;
  take: number;
  organization_id: number;
}

export type ChangeRoleDto = Pick<User, "role" | "id">;

export type CreateElectionOfficerDto = Pick<
  User,
  "firstname" | "lastname" | "username" | "email_address"
> & {
  organization_id: Organization["id"];
};

export type UpdateElectionOfficerDto = Pick<
  User,
  "id" | "firstname" | "lastname" | "email_address" | "username"
>;

export type GetOfficerByIdDto = {
  user_id: User["id"];
  organization_id: Organization["id"];
};
