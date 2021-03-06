import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreatePartyBody,
  GetPartyBody,
  UpdatePartyBody,
} from "./party.interface";
import partyService from "./party.service";
import { unflatten } from "flat";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const electionId = req.params.electionId;
    const { page, take, order, search, withArchive } = req.query as any;

    res.status(200).json(
      await partyService.getAll(electionId, {
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

    res.status(200).json(await partyService.getById(id));
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.files?.logo as fileUpload.UploadedFile;

    const party = unflatten<CreatePartyBody, any>(req.body);

    const cover = req.files?.cover as fileUpload.UploadedFile;

    console.log(logo, party, cover);

    res.status(200).json(await partyService.create(logo, party, cover));
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.files
      ? (req.files.logo as fileUpload.UploadedFile)
      : undefined;

    const party = unflatten<UpdatePartyBody, any>(req.body);

    const cover = req.files
      ? (req.files.cover as fileUpload.UploadedFile)
      : undefined;

    console.log(logo, party, cover);

    res.status(200).json(await partyService.update(logo, party, cover));
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await partyService.remove(id));
  } catch (error) {
    next(error);
  }
};

const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await partyService.restore(id));
  } catch (error) {
    next(error);
  }
};

const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await partyService.archive(id));
  } catch (error) {
    next(error);
  }
};

const unarchive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await partyService.unarchive(id));
  } catch (error) {
    next(error);
  }
};

const partyController = {
  getAll,
  getOneById,
  create,
  update,
  remove,
  restore,
  archive,
  unarchive,
};

export default partyController;
