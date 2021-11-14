import { NextFunction, Request, Response } from "express";
import authServices from "./auth.service";

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await req.logout();
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    next(error);
  }
};

const authController = { logout };

export default authController;
