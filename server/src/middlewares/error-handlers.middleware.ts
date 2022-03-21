import { NextFunction, Request, Response } from "express";
import { HttpException } from "../helpers/errors/http.exception";

const errorHandler = (
  err: Error & HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err) {
    // if (err.stack) console.error(err.stack);
    res.status(err.statusCode || 500).json({
      error: {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        fields: err.fields,
      },
    });
    return;
  }

  next();
};

export default errorHandler;
