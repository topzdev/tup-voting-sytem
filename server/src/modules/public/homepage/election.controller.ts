import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreateElectionBody,
  UpdateElectionBody,
  GetElectionBody,
} from "../../election/election.interface";
import electionService from "./election.service";
import { unflatten } from "flat";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.params.org_id;

    const { page, take, order, search, withArchive } = req.query as any;

    res.status(200).json(
      await electionService.getAll(orgId, {
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

const electionController = {
    getAll,
  };
  
export default electionController;