import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { unflatten } from "flat";
import {
  CreateCandidateBody,
  UpdateCandidateBody,
} from "./candidate.interface";
import candidateService from "./candidate.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const election_id = req.params.election_id;
    const { page, take, order, search, withArchive, partyId, positionId } =
      req.query as any;

    res.status(200).json(
      await candidateService.getAll(election_id, {
        page: page ? parseInt(page) : undefined,
        take: take ? parseInt(take) : undefined,
        order,
        search,
        partyId,
        positionId,
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

    res.status(200).json(await candidateService.getById(id));
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile_photo = req.files.profile_photo as fileUpload.UploadedFile;
    const cover_photo = req.files.cover_photo as fileUpload.UploadedFile;
    const candidate = unflatten<CreateCandidateBody, any>(req.body);

    console.log(profile_photo, cover_photo, candidate);

    res
      .status(200)
      .json(
        await candidateService.create(profile_photo, cover_photo, candidate)
      );
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile_photo = req.files
      ? (req.files.profile_photo as fileUpload.UploadedFile)
      : undefined;

    const cover_photo = req.files
      ? (req.files.cover_photo as fileUpload.UploadedFile)
      : undefined;

    const candidate = unflatten<UpdateCandidateBody, any>(req.body);

    console.log(profile_photo, cover_photo, candidate);

    res
      .status(200)
      .json(
        await candidateService.update(profile_photo, cover_photo, candidate)
      );
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await candidateService.remove(id));
  } catch (error) {
    next(error);
  }
};

const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await candidateService.restore(id));
  } catch (error) {
    next(error);
  }
};

const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await candidateService.archive(id));
  } catch (error) {
    next(error);
  }
};

const unarchive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await candidateService.unarchive(id));
  } catch (error) {
    next(error);
  }
};

const importFromCSV = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const candidateCSV = req.files["candidates-csv"] as fileUpload.UploadedFile;
    console.log("RAW CSV", candidateCSV);
    res
      .status(200)
      .json(await candidateService.importCandidatesFromCSV(candidateCSV));
  } catch (error) {
    next(error);
  }
};

const candidateController = {
  getAll,
  getOneById,
  create,
  update,
  remove,
  restore,
  archive,
  unarchive,
  importFromCSV,
};

export default candidateController;
