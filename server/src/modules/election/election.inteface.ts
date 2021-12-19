import { Election } from "./entity/election.entity";

export interface GetElectionBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  orgId: number;
  withArchive?: boolean;
}

export type CreateElectionBody = Pick<
  Election,
  | "title"
  | "description"
  | "start_date"
  | "close_date"
  | "slug"
  | "organization_id"
>;

export type UpdateElectionBody = Pick<
  Election,
  | "id"
  | "title"
  | "description"
  | "start_date"
  | "close_date"
  | "slug"
  | "organization_id"
>;
