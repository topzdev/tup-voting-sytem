import { Party } from "./entity/party.entity";

export interface GetParty {
  search?: string;
  order?: any;
  page: number;
  take: number;
  elecId: number;
  withArchive?: boolean;
}

export type CreateParty = Pick<
  Party,
  | "ticker"
  | "title"
  | "description"
  | "election_id"
>;

export type UpdateParty = Pick<
  Party,
  | "id"
  | "ticker"
  | "title"
  | "description"
  | "election_id"
>;