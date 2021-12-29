import { QueryFailedError } from "typeorm";

export const isEmptyStringReturnNull = (str: string) => {
  return str === "" ? null : str;
};

export const exportCSVDetailedError = (error: any) => {
  if (!(error instanceof QueryFailedError)) return error;

  const driverError = error.driverError;

  if (driverError.code === "23505") {
    return {
      name: "Data Duplicate Error",
      message: driverError.detail,
      statusCode: 400,
    };
  } else {
    return error;
  }
};
