import { NextFunction, Request, Response } from "express";
import securityServices from "./security.service";

const TEST_pin_encrypt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const passwords = req.body.passwords;
    res.status(200).json(await securityServices.TEST_pin_encrypt(passwords));
  } catch (error) {
    next(error);
  }
};

const TEST_pin_decrypt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const passwords = req.body.passwords;
    res.status(200).json(await securityServices.TEST_pin_decrypt(passwords));
  } catch (error) {
    next(error);
  }
};

const securityController = {
  TEST_pin_encrypt,
  TEST_pin_decrypt,
};

export default securityController;
