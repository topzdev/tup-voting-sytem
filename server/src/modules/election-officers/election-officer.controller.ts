import { NextFunction, Request, Response } from "express";
import {
  CreateElectionOfficerDto,
  UpdateElectionOfficerDto,
} from "./election-officer.inteface";
import userServices from "./election-officer.service";
import electionOfficerService from "./election-officer.service";

const getOfficers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, take, order, search, organization_id } = req.body as any;

    res.status(200).json(
      await electionOfficerService.getOfficers({
        page,
        take,
        order,
        search,
        organization_id,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getOfficerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as any;

    res.status(200).json(await electionOfficerService.getOfficerById(dto));
  } catch (error) {
    next(error);
  }
};

const create = async (
  req: Request<{}, { user: CreateElectionOfficerDto }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body;
    res.status(200).json(await electionOfficerService.create(user));
  } catch (error) {
    next(error);
  }
};

const update = async (
  req: Request<{}, { user: UpdateElectionOfficerDto }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body;
    res.status(200).json(await electionOfficerService.update(user));
  } catch (error) {
    next(error);
  }
};

const electionOfficersController = {
  getOfficers,
  getOfficerById,
  create,
  update,
};

export default electionOfficersController;
