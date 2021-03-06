import { QueryFailedError } from "typeorm";
import { customAlphabet } from "nanoid";
import {
  decryptPin,
  encryptPin,
  genHashedPassword,
} from "../../helpers/password.helper";

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

export const generateCredentials = () => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 10);
  const pin = encryptPin(nanoid());
  return {
    pin,
    voter_id: nanoid(),
  };
};

export const voterPinParser = (possbileHashedPin: string) => {
  const decryptedPin = decryptPin(possbileHashedPin);

  if (decryptedPin) {
    return decryptedPin;
  } else {
    return possbileHashedPin;
  }
};

export const findDuplicate = (array: any[]) => {
  const duplicateEmailAddress = [];

  const tempArray = array.sort((a, b) => a.localeCompare(b));

  for (let i = 0; i < tempArray.length; i++) {
    if (tempArray[i + 1] === tempArray[i]) {
      duplicateEmailAddress.push(tempArray[i]);
    }
  }

  return duplicateEmailAddress;
};

const voterHelpers = {
  findDuplicate,
};

export default voterHelpers;
