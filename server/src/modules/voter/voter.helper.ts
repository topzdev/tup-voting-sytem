import { QueryFailedError } from "typeorm";
import {} from "nanoid";

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

const { customAlphabet } = require("nanoid");
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 10);

export const generateCredentials = () => {
  return {
    pin: nanoid(),
    voter_id: nanoid(),
  };
};
