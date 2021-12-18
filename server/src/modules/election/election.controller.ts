import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreateElectionBody,
  UpdateElectionBody,
  GetElectionBody,
} from "./election.inteface";
import electionService from "./election.service";
import { unflatten } from "flat";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, take, order, search, withArchive } = req.query as any;

    res.status(200).json(
      await electionService.getAll({
        page: page ? parseInt(page) : undefined,
        take: take ? parseInt(take) : undefined,
        order,
        search,
        withArchive: withArchive ? Boolean(withArchive) : undefined,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await electionService.getById(id));
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.files.logo as fileUpload.UploadedFile;

    const election = unflatten<CreateElectionBody, any>(req.body);

    console.log(logo, election);

    res.status(200).json(await electionService.create(logo, election));
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.files
      ? (req.files.logo as fileUpload.UploadedFile)
      : undefined;

    const election = unflatten<UpdateElectionBody, any>(req.body);

    console.log(logo, election);

    res.status(200).json(await electionService.update(logo, election));
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await electionService.remove(id));
  } catch (error) {
    next(error);
  }
};

const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await electionService.restore(id));
  } catch (error) {
    next(error);
  }
};

const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await electionService.archive(id));
  } catch (error) {
    next(error);
  }
};

const unarchive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await electionService.unarchive(id));
  } catch (error) {
    next(error);
  }
};

const electionController = {
  getAll,
  getOneById,
  create,
  update,
  remove,
  restore,
  archive,
  unarchive,
};

export default electionController;
