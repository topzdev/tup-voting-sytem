import { Request, Response, NextFunction } from "express";
import launchpadServices from "./launchpad.service";

const getElectionBallot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const electionId = req.params.election_id;
    res
      .status(200)
      .json(await launchpadServices.getElectionBallot(parseInt(electionId)));
  } catch (error) {
    next(error);
  }
};

const getElectionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(await launchpadServices.getElectionDetails(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const getElectionValidations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(
        await launchpadServices.launchpadValidations(parseInt(election_id))
      );
  } catch (error) {
    next(error);
  }
};

const launchElection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(await launchpadServices.launchElection(parseInt(election_id)));
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
      .json(await launchpadServices.getElectionById(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const getAllElection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization_id = req.params.organization_id;
    res
      .status(200)
      .json(await launchpadServices.getAllElection(parseInt(organization_id)));
  } catch (error) {
    next(error);
  }
};

const launchpadController = {
  getElectionBallot,
  getAllElection,
  getElectionById,
  getElectionDetails,
  launchElection,
  getElectionValidations,
};

export default launchpadController;
