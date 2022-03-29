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

const getElectionWinners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(await resultsServices.getElectionWinners(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const downloadElectionResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    const { filename, file } = await resultsServices.downloadElectionResults(
      parseInt(election_id)
    );

    res
      .status(200)
      .header("Content-Type", "text/csv")
      .attachment(filename)
      .send(file);
  } catch (error) {
    next(error);
  }
};

const downloadVoteAudit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    const { filename, file } = await resultsServices.downloadVoteAudit(
      parseInt(election_id)
    );

    res
      .status(200)
      .header("Content-Type", "text/csv")
      .attachment(filename)
      .send(file);
  } catch (error) {
    next(error);
  }
};

const resultsController = {
  getElectionResults,
  getElectionWinners,
  downloadElectionResults,
  downloadVoteAudit,
};

export default resultsController;
