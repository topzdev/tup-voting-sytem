import { SanitizationChain } from "express-validator";

const sanitize = (sanitizers: SanitizationChain[]) => {
  return sanitizers;
};

export default sanitize;
