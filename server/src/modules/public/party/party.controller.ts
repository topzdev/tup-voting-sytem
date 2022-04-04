import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
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

const partyController = {
    getAll,
  };
  
  export default partyController;
  