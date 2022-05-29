import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreateElectionBody,
  UpdateElectionBody,
  GetElectionBody,
} from "./election.interface";
import electionService from "./election.service";
import { unflatten } from "flat";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.params.org_id;
    const user = req.admin;

    const { page, take, order, search, withArchive } = req.query as any;

    res.status(200).json(
      await electionService.getAll(parseInt(orgId), user, {
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

const getElectionWinners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    res
      .status(200)
      .json(await electionService.getElectionWinners(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const getOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = req.admin;
    res.status(200).json(await electionService.getById(user, id));
  } catch (error) {
    next(error);
  }
};

const getOneBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;

    res.status(200).json(await electionService.getBySlug(slug));
  } catch (error) {
    next(error);
  }
};

const isExistBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;

    res.status(200).json(await electionService.isExistBySlug(slug));
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
  getOneBySlug,
  isExistBySlug,
  getElectionWinners,
};

export default electionController;
