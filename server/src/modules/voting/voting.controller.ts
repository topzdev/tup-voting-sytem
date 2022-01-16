import { Request, Response, NextFunction } from "express";
import { Ballot } from "./voting.interface";
import votingServices from "./voting.service";

const getElectionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(await votingServices.getElectionById(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const getElectionBallot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(await votingServices.getElectionBallot(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const getCandidateInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const candidate_id = req.params.candidate_id;
    res
      .status(200)
      .json(await votingServices.getCandidateInfo(parseInt(candidate_id)));
  } catch (error) {
    next(error);
  }
};

const submitBallot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ua = req.ua;
    const ip = req.client_ip;
    const voter_id = req.voter.id;
    const ballot = req.body as Ballot;

    res
      .status(200)
      .json(await votingServices.submitBallot(voter_id, ballot, { ua, ip }));
  } catch (error) {
    next(error);
  }
};

const votingController = {
  submitBallot,
  getElectionBallot,
  getElectionById,
  getCandidateInfo,
};

export default votingController;
