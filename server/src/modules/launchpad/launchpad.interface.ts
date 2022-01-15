import {
  Election,
  ElectionStatusEnum,
} from "../election/entity/election.entity";
import { Position } from "../position/entity/position.entity";

type ElectionStatus = "building" | "running" | "completed" | "archived";

export type ElectionWithStatusFinal = Election & {
  final_status: ElectionStatus;
};

export type LaunchpadValidationData = Omit<
  ElectionWithStatusFinal,
  "positions"
> & {
  votersCount: number;
  partiesCount: number;
  candidatesCount: number;
  positionsCount: number;
} & {
  positions: (Position & {
    candidatesCount: number;
  })[];
};

type ValidationSeverity = "warning" | "error" | "info";

export type LaunchpadValidation = {
  title: string;
  message: string;
  severity: ValidationSeverity;
};

export type LaunchpadValidations = {
  errors: LaunchpadValidation[];
  warnings: LaunchpadValidation[];
  info: LaunchpadValidation[];
};
