import { NextFunction, Request, Response } from "express";
import electionService from "./homepage.service";

const getElectionsContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, take, order, search } = req.query as any;

    res.status(200).json(await electionService.getElectionsContent());
  } catch (error) {
    next(error);
  }
};

const getPartiesContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, take, order, search } = req.query as any;

    res.status(200).json(await electionService.getPartiesContent());
  } catch (error) {
    next(error);
  }
};

const homepageController = {
  getElectionsContent,
  getPartiesContent,
};

export default homepageController;
