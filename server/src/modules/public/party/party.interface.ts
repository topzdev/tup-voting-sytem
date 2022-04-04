import { Party } from "../../party/entity/party.entity";

export interface GetPartyBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  withArchive?: boolean;
}

export type CreatePartyBody = Pick<
  Party,
  | "ticker"
  | "title"
  | "description"
  | "election_id"
>;

export type UpdatePartyBody
 = Pick<
  Party,
  | "id"
  | "ticker"
  | "title"
  | "description"
  | "election_id"
>;