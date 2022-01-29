import { ElectionStatus } from "../services/election.service";

export const statusOnlyAllowed = (
  currentStatus: ElectionStatus,
  allowedStatus: ElectionStatus[]
) => {
  return !!allowedStatus.find((item) => item === currentStatus);
};

export const statusNotAllowed = (
  currentStatus: ElectionStatus,
  notAllowedStatus: ElectionStatus[]
) => {
  return !!notAllowedStatus.find((item) => item !== currentStatus);
};
