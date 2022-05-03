import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { unflatten } from "flat";
import candidateService from "./candidate.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const election_id = req.params.election_id;
    const { page, take, order, search, withArchive, party, position, } =
      req.query as any;

    res.status(200).json(
      await candidateService.getAll(election_id, {
        page: page ? parseInt(page) : undefined,
        take: take ? parseInt(take) : undefined,
        order,
        search,
        party,
        position,
        withArchive: withArchive ? Boolean(withArchive) : undefined,
      })
    );
  } catch (error) {
    next(error);
  }
};

const candidateController = {
  getAll,
};

export default candidateController;