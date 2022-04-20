import { NextFunction, Request, Response } from "express";
import securityServices from "./security.service";

const getElectionSecurity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(await securityServices.getElectionSecurity(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const securityController = {
  getElectionSecurity,
};

export default securityController;
