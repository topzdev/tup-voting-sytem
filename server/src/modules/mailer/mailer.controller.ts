import { Request, Response, NextFunction } from "express";
import mailerServices from "./mailer.service";

const sendVotersCredentialsEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.body.election_id;
    const voters_ids = req.body.voters_ids;
    res
      .status(200)
      .json(
        await mailerServices.sendVotersCredentialsEmail(
          parseInt(election_id),
          voters_ids
        )
      );
  } catch (error) {
    next(error);
  }
};

const sendThankYouForVotingEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const voters_id = req.body.voters_id;
    res
      .status(200)
      .json(await mailerServices.sendThankYouForVotingEmail(voters_id));
  } catch (error) {
    next(error);
  }
};

const sendElectionHasLaunched = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_ids = req.body.election_ids;
    res
      .status(200)
      .json(await mailerServices.sendElectionHasLaunched(election_ids));
  } catch (error) {
    next(error);
  }
};

const sendElectionHasEnded = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_ids = req.body.election_ids;
    res
      .status(200)
      .json(await mailerServices.sendElectionHasEnded(election_ids));
  } catch (error) {
    next(error);
  }
};

const mailerController = {
  sendVotersCredentialsEmail,
  sendThankYouForVotingEmail,
  sendElectionHasLaunched,
  sendElectionHasEnded,
};

export default mailerController;
