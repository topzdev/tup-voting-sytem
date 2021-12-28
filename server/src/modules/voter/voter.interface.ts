import { ElectionMember } from "../election/entity/election-member.entity";
import { Voter } from "./entity/voter.entity";

export interface GetVoterBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  org_id: number;
  withArchive?: boolean;
}

export type CreateVoterBody = Pick<
  Voter,
  | "voter_id"
  | "firstname"
  | "lastname"
  | "pin"
  | "email_address"
  | "organization_id"
> &
  Pick<ElectionMember, "election_id">;

export type UpdateVoterBody = Pick<
  Voter,
  | "id"
  | "firstname"
  | "lastname"
  | "voter_id"
  | "pin"
  | "email_address"
  | "organization_id"
>;

export type ImportVotersByElectionDto = {
  electionIds: {
    from: number;
    to: number;
  };
};
