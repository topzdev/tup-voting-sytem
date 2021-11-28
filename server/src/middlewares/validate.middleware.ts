import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { HttpException } from "../helpers/errors/http.exception";

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return msg;
};

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      next(
        new HttpException(
          "BAD_REQUEST",
          "Body validation error",
          errors.mapped()
        )
      );
    }

    return next();
  };
};

export default validate;
