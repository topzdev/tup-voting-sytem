import {
  Election,
  ElectionStatusEnum,
} from "../election/entity/election.entity";

type ElectionStatus = "building" | "running" | "completed" | "archived";

export type ElectionWithStatusFinal = Election & {
  status_final: ElectionStatus;
};
