import { NextFunction, Request, Response } from "express";

export const getClientInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.client_ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  req.ua = req.get("User-Agent");

  next();
};

export default {
  getClientInfo,
};
