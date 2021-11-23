import { NextFunction, Request, Response } from "express";
import { HttpException } from "../helpers/errors/http.exception";
import jwt from "jsonwebtoken";
import configs from "../configs";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenParts = req.headers.authorization.split(" ");

    console.log("Authorization", req.headers.authorization);

    if (
      tokenParts[0] === "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      console.log("Token Parts", tokenParts[1]);
      const decoded = jwt.verify(tokenParts[1], configs.jwt.admin.secret);

      req.jwt = decoded;
      if (typeof decoded !== "string") req.admin = decoded.admin;

      next();
    } else {
      next(
        new HttpException(
          "UNAUTHORIZED",
          "You dont have admin privilege, Please contact administrator"
        )
      );
    }
  } catch (error) {
    console.log(error);

    next(
      new HttpException(
        "UNAUTHORIZED",
        "You dont have admin privilege, Please contact administrator"
      )
    );
  }
};

export default {
  adminAuth,
};
