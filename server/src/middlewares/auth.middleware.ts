import { NextFunction, Request, Response } from "express";
import { HttpException } from "../helpers/errors/http.exception";
import jwt from "jsonwebtoken";
import configs from "../configs";
import { config } from "dotenv";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenParts = req.headers.authorization.split(" ");

    console.log("Admin Authorization", req.headers.authorization);

    if (
      tokenParts[0] !== "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      throw Error();
    }

    console.log(configs.jwt.admin);

    console.log("Token Parts", tokenParts[1]);
    const decoded = jwt.verify(tokenParts[1], configs.jwt.admin.secret);

    req.admin_jwt = decoded;
    if (typeof decoded !== "string") req.admin = decoded.admin;

    next();
  } catch (error) {
    console.log("Auth Admin Error: ", error);
    next(
      new HttpException(
        "UNAUTHORIZED",
        "You dont have admin privilege, Please contact administrator"
      )
    );
  }
};

export const voterAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenParts = req.headers.authorization.split(" ");

    console.log("Voter Authorization", req.headers.authorization);

    if (
      tokenParts[0] !== "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      throw Error();
    }

    console.log(
      "Token Parts",
      tokenParts[1],
      "Configs",
      configs.jwt.voter.secret
    );
    const decoded = jwt.verify(tokenParts[1], configs.jwt.voter.secret);

    console.log("Decoded", decoded);

    req.voter_jwt = decoded;
    if (typeof decoded !== "string") req.voter = decoded.voter;

    next();
  } catch (error) {
    console.error("Catch Error: ", error);
    next(new HttpException("UNAUTHORIZED", "Something went wrong"));
  }
};

export default {
  adminAuth,
  voterAuth,
};
