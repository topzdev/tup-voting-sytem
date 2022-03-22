import { NextFunction, Request, Response } from "express";
import resultsServices from "./results.service";

const getElectionResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(await resultsServices.getElectionResults(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const resultsController = {
  getElectionResults,
};

export default resultsController;
