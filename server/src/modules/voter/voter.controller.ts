import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreateVoterBody,
  UpdateVoterBody,
  GetVoterBody,
} from "./voter.interface";
import voterService from "./voter.service";
import { unflatten } from "flat";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, take, order, search, withArchive, orgId } = req.query as any;

    res.status(200).json(
      await voterService.getAll({
        page: page ? parseInt(page) : undefined,
        take: take ? parseInt(take) : undefined,
        order,
        search,
        withArchive: withArchive ? Boolean(withArchive) : undefined,
        orgId,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await voterService.getById(id));
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

    res.status(200).json(await voterService.getBySlug(slug));
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

    res.status(200).json(await voterService.isExistBySlug(slug));
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.files.logo as fileUpload.UploadedFile;

    const voter = unflatten<CreateVoterBody, any>(req.body);

    console.log(logo, voter);

    res.status(200).json(await voterService.create(logo, voter));
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.files
      ? (req.files.logo as fileUpload.UploadedFile)
      : undefined;

    const voter = unflatten<UpdateVoterBody, any>(req.body);

    console.log(logo, voter);

    res.status(200).json(await voterService.update(logo, voter));
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await voterService.remove(id));
  } catch (error) {
    next(error);
  }
};

const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await voterService.restore(id));
  } catch (error) {
    next(error);
  }
};

const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await voterService.archive(id));
  } catch (error) {
    next(error);
  }
};

const unarchive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await voterService.unarchive(id));
  } catch (error) {
    next(error);
  }
};

const voterController = {
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
};

export default voterController;
