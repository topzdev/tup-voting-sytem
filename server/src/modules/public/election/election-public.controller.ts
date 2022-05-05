import { NextFunction, Request, Response } from "express";
import electionService from "./election-public.service";

const getElectionContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;
    res.status(200).json(await electionService.getElectionContent(slug));
  } catch (error) {
    next(error);
  }
};

const getElectionLongUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.body.id;
    res.status(200).json(await electionService.getElectionLongUrl(id));
  } catch (error) {
    next(error);
  }
};

const electionPublicController = {
  getElectionContent,
  getElectionLongUrl,
};

export default electionPublicController;
