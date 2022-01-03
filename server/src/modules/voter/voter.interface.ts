import { Voter } from "./entity/voter.entity";

export interface GetVoterBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  election_id: number;
}

export interface GetVoterElectionDto {
  order?: any;
  page: number;
  take: number;
  voter_id: number;
}

export type GetElectionMembersDto = {
  election_id: number;
};

export type CreateVoterBody = Pick<
  Voter,
  | "firstname"
  | "lastname"
  | "pin"
  | "email_address"
  | "election_id"
  | "username"
>;

export type UpdateVoterBody = Pick<
  Voter,
  "id" | "firstname" | "lastname" | "pin" | "email_address" | "username"
>;

export type ImportVotersByElectionDto = {
  electionIds: {
    from: number;
    to: number;
  };
};

export type ImportVotersByCSVDto = {
  election_id: number;
};

export type DisallowVotersDto = {
  voter_ids: number[];
  election_id: number;
};

export type AllowVotersDto = {
  voter_ids: number[];
  election_id: number;
};

export type RemoveVotersDto = {
  voter_ids: number[];
  election_id: number;
};
