import { NextFunction, Request, Response } from "express";
import { HttpException } from "../helpers/errors/http.exception";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    next(
      new HttpException(
        "UNAUTHORIZED",
        "You dont have admin privilege, Please contact administrator"
      )
    );
  }
};
