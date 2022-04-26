import { customAlphabet } from "nanoid";

const numbers = "0123456789";

const nanoid = customAlphabet(numbers);

export const generateOTP = () => {
  return nanoid(6);
};

const authHelpers = { generateOTP };

export default authHelpers;
