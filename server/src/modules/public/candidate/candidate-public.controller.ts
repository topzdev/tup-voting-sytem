import { NextFunction, Request, Response } from "express";
import candidateService from "./candidate-public.service";

const getCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const candidate_id = req.params.candidate_id;

    res
      .status(200)
      .json(await candidateService.getCandidate(parseInt(candidate_id)));
  } catch (error) {
    next(error);
  }
};

const candidatePublicController = {
  getCandidate,
};

export default candidatePublicController;
