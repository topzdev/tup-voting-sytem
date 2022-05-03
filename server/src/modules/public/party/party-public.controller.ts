import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import partyService from "./party-public.service";
import { unflatten } from "flat";

const getPartyContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const party_id = req.params.party_id;

    res
      .status(200)
      .json(await partyService.getPartyContent(parseInt(party_id)));
  } catch (error) {
    next(error);
  }
};

const partyController = {
  getPartyContent,
};

export default partyController;
