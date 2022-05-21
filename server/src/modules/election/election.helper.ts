import { customAlphabet } from "nanoid";

const generateElectionSlug = () => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 10);
  return nanoid();
};

const isEmptyStringReturnNull = (str: string) => {
  return str === "" ? null : str;
};

const electionHelper = {
  generateElectionSlug,
  isEmptyStringReturnNull,
};

export default electionHelper;
