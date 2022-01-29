import {
    Election,
    ElectionStatusEnum,
  } from "../election/entity/election.entity";
import { Position } from "../position/entity/position.entity";
type ElectionStatus = "building" | "running" | "completed" | "archived";

export type ElectionWithStatusFinal = Election & {
    final_status: ElectionStatus;
  };

export type SettingsValidationData = Omit<
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

export type SettingsValidation = {
  title: string;
  message: string;
  severity: ValidationSeverity;
};

export type SettingsValidations = {
  errors: SettingsValidation[];
  warnings: SettingsValidation[];
  info: SettingsValidation[];
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