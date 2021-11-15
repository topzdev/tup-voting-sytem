import bcrypt from "bcrypt";
import configs from "../configs";

export const genPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(configs.auth.saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validatePassword = async (
  _password: string,
  _hashPassword: string
) => {
  return await bcrypt.compare(_password, _hashPassword);
};
