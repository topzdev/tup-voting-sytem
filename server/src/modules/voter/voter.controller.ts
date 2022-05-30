import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { unflatten } from "flat";
import {
  CreateVoterBody,
  ImportVotersByCSVDto,
  ImportVotersByElectionDto,
  RemoveVotersDto,
  UpdateVoterBody,
} from "./voter.interface";
import voterService from "./voter.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const electionId = req.params.electionId;
    const { page, take, order, search, availability, registration } =
      req.query as any;

    res.status(200).json(
      await voterService.getAll(electionId, {
        page: page ? parseInt(page) : undefined,
        take: take ? parseInt(take) : undefined,
        order,
        search,
        availability,
        registration,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getAllPreRegistered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.params.election_id;
    const { page, take, order, search, availability, registration } =
      req.query as any;

    res.status(200).json(
      await voterService.getAllPreRegistered(election_id, {
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

const grantPreRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const election_id = req.body.election_id;
    const voters_ids = req.body.voter_ids;
    res
      .status(200)
      .json(
        await voterService.grantPreRegister(parseInt(election_id), voters_ids)
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

const getOneByEmailAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email_address = req.params.email;

    res.status(200).json(await voterService.getByEmailAddress(email_address));
  } catch (error) {
    next(error);
  }
};

const isExistByEmailAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email_address = req.params.email;

    res
      .status(200)
      .json(await voterService.isExistByEmailAddress(email_address));
  } catch (error) {
    next(error);
  }
};

const getOneByVoterId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const voter_id = req.params.voterId;

    res.status(200).json(await voterService.getByVoterId(voter_id));
  } catch (error) {
    next(error);
  }
};

const isExistByVoterId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const voter_id = req.params.voterId;

    res.status(200).json(await voterService.isExistByVoterId(voter_id));
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const voter = unflatten<CreateVoterBody, any>(req.body);
    res.status(200).json(await voterService.create(voter));
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const voter = unflatten<UpdateVoterBody, any>(req.body);

    res.status(200).json(await voterService.update(voter));
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

const exportVotersToCSV = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const electionId = parseInt(req.params.electionId);

    const { file, filename } = await voterService.exportVotersToCSV(electionId);

    res
      .status(200)
      .header("Content-Type", "text/csv")
      .attachment(filename)
      .send(file);
  } catch (error) {
    next(error);
  }
};

const importVotersByElection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as ImportVotersByElectionDto;
    res.status(200).json(await voterService.importVotersByElection(dto));
  } catch (error) {
    next(error);
  }
};

const importVotersByCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as ImportVotersByCSVDto;
    const file = req.files["voters-csv"] as fileUpload.UploadedFile;

    res.status(200).json(await voterService.importVotersByCSV(file, dto));
  } catch (error) {
    next(error);
  }
};

const disableVoters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body;
    res.status(200).json(await voterService.disableVoters(dto));
  } catch (error) {
    next(error);
  }
};

const enableVoters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body;
    res.status(200).json(await voterService.enableVoters(dto));
  } catch (error) {
    next(error);
  }
};

const removeVoters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as RemoveVotersDto;
    res.status(200).json(await voterService.removeVoters(dto));
  } catch (error) {
    next(error);
  }
};

const getElectionVoters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.query as any;
    res.status(200).json(await voterService.getElectionVoters(dto));
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

  getOneByEmailAddress,
  getOneByVoterId,
  isExistByEmailAddress,
  isExistByVoterId,

  exportVotersToCSV,
  importVotersByElection,
  importVotersByCsv,

  disableVoters,
  enableVoters,
  removeVoters,
  getElectionVoters,

  grantPreRegister,
  getAllPreRegistered,
};

export default voterController;
