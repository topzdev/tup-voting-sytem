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

const resolveTie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body;
    res.status(200).json(await resultsServices.resolveTie(dto));
  } catch (error) {
    next(error);
  }
};

const resetTie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const position_id = req.body.position_id;
    res.status(200).json(await resultsServices.resetTie(parseInt(position_id)));
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

const publishResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.body.election_id;

    res
      .status(200)
      .json(await resultsServices.publishResult(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const unPublishResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.body.election_id;

    res
      .status(200)
      .json(await resultsServices.unPublishResult(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const printElectionResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.body.election_id;

    res
      .status(200)
      .json(await resultsServices.printElectionResult(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const resultsController = {
  getElectionResults,
  getElectionWinners,
  downloadElectionResults,
  downloadVoteAudit,
  resetTie,
  resolveTie,
  publishResult,
  unPublishResult,
  printElectionResult,
};

export default resultsController;
