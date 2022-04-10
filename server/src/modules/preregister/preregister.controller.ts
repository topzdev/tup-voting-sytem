import { NextFunction, Request, Response } from "express";
import preregisterServices from "./preregister.service";

const getElection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    res.status(200).json(await preregisterServices.getElection(slug));
  } catch (error) {
    next(error);
  }
};

const isRegistered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email_address = req.body.email_address;
    const election_id = req.body.election_id;
    res.status(200).json(
      await preregisterServices.isRegistered({
        _election_id: election_id,
        _email_address: email_address,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getVoterInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.body.code;
    res.status(200).json(await preregisterServices.getVoterInfo(code));
  } catch (error) {
    next(error);
  }
};

const preRegisterVoter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const voter_info = req.body;
    res
      .status(200)
      .json(await preregisterServices.preRegisterVoter(voter_info));
  } catch (error) {
    next(error);
  }
};

const preregisterController = {
  getVoterInfo,
  getElection,
  isRegistered,
  preRegisterVoter,
};

export default preregisterController;
