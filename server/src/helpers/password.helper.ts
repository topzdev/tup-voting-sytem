import bcrypt from "bcrypt";
import configs from "../configs";
import cryptoJs from "crypto-js";

const cryptoSecretKey = configs.auth.voterCryptoSecretKey;
const adminSaltRounds = configs.auth.adminSaltRounds;

export const genHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(adminSaltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validatePassword = async (
  _password: string,
  _hashPassword: string
) => {
  return await bcrypt.compare(_password, _hashPassword);
};

export const encryptPin = (pin: string) => {
  return cryptoJs.AES.encrypt(pin, cryptoSecretKey).toString();
};

export const decryptPin = (hashedPin: string) => {
  const bytes = cryptoJs.AES.decrypt(hashedPin, cryptoSecretKey);
  return bytes.toString(cryptoJs.enc.Utf8);
};

export const validatePin = (hashedPin: string, pin: string) => {
  return decryptPin(hashedPin) === pin;
};
