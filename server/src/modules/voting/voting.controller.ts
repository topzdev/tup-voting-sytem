import { Request, Response, NextFunction } from "express";
import { unflatten } from "flat";
import { BallotVotes } from "./voting.interface";
import votingServices from "./voting.service";

const getElectionBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;
    res.status(200).json(await votingServices.getElectionBySlug(slug));
  } catch (error) {
    next(error);
  }
};

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
    const voter_id = req.voter.id;
    res
      .status(200)
      .json(
        await votingServices.getElectionBallot(parseInt(election_id), voter_id)
      );
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
    console.log(req.voter);

    const ua = req.ua;
    const ip = req.client_ip;
    const voter_id = req.voter.id;
    const ballot = req.body as BallotVotes;

    res
      .status(200)
      .json(await votingServices.submitBallot(voter_id, ballot, { ua, ip }));

    // res.status(200).json(ballot);
  } catch (error) {
    next(error);
  }
};

const votingController = {
  submitBallot,
  getElectionBallot,
  getElectionById,
  getCandidateInfo,
  getElectionBySlug,
};

export default votingController;
