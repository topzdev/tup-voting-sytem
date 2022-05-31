import { Voter } from "./entity/voter.entity";

export interface GetVoterBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  availability: "all" | "disabled" | "enabled";
  registration: "all" | "reg" | "prereg";
}

export interface GetPregisteredVoterBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
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
  "firstname" | "lastname" | "email_address" | "election_id"
>;

export type UpdateVoterBody = Pick<
  Voter,
  "id" | "firstname" | "lastname" | "pin" | "email_address"
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

export type DisableVotersDto = {
  voter_ids: number[];
  election_id: number;
};

export type EnableVotersDto = {
  voter_ids: number[];
  election_id: number;
};

export type RemoveVotersDto = {
  voter_ids: number[];
  election_id: number;
};
