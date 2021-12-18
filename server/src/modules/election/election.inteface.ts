import { Election } from "./entity/election.entity";

export interface GetElectionBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  withArchive?: boolean;
}

export type CreateElectionBody = Pick<Election, "id">;

export type UpdateElectionBody = Pick<Election, "id">;
