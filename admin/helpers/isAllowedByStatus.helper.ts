import { ElectionStatus } from "../services/election.service";

export const statusOnlyAllowed = (
  currentStatus: ElectionStatus,
  allowedStatus: ElectionStatus[]
) => {
  console.log("Allowed", allowedStatus);

  return !!allowedStatus.find((item) => item === currentStatus);
};

export const statusNotAllowed = (
  currentStatus: ElectionStatus,
  notAllowedStatus: ElectionStatus[]
) => {
  return !!notAllowedStatus.find((item) => item !== currentStatus);
};
