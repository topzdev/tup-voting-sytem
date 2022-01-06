import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreatePositionBody,
  UpdatePositionBody,
  GetPositionBody,
  UpdatePositionDisplayOrder,
} from "./position.interface";
import positionService from "./position.service";
import { unflatten } from "flat";
import { UpdateElectionBody } from "../election/election.interface";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const electionId = parseInt(req.params.electionId);
    const { page, take, order, search, withArchive } = req.query as any;

    res.status(200).json(
      await positionService.getAll(electionId, {
        page: page ? parseInt(page) : undefined,
        take: take ? parseInt(take) : undefined,
        order,
        search,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await positionService.getById(id));
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const position = req.body;

    console.log("Position Create Body", position);

    res.status(200).json(await positionService.create(position));
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const position = req.body;

    console.log("Position Updated Body", position);

    res.status(200).json(await positionService.update(position));
  } catch (error) {
    next(error);
  }
};

const updateDisplayOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = unflatten<UpdatePositionDisplayOrder, any>(req.body);

    res.status(200).json(await positionService.updateDisplayOrder(body));
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await positionService.remove(id));
  } catch (error) {
    next(error);
  }
};

const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await positionService.restore(id));
  } catch (error) {
    next(error);
  }
};

const positionController = {
  getAll,
  getOneById,
  create,
  update,
  remove,
  restore,
  updateDisplayOrder,
};

export default positionController;
