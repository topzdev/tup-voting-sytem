import { Election } from "../election/entity/election.entity";
type ElectionStatus = "building" | "running" | "completed" | "archived";

export type ElectionWithStatusFinal = Election & {
  final_status: ElectionStatus;
};

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
