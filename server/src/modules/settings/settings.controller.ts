import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreateElectionBody,
  UpdateElectionBody,
  GetElectionBody,
} from "../election/election.interface";
import settingsService from "./settings.service";
import { unflatten } from "flat";

const updateGeneral = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logo = req.files
        ? (req.files.logo as fileUpload.UploadedFile)
        : undefined;
  
      const election = unflatten<UpdateElectionBody, any>(req.body);
  
      console.log(logo, election);
  
      res.status(200).json(await settingsService.updateGeneral(logo, election));
      
    } catch (error) {
      next(error);
    }
  }; 

const updateDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const election = unflatten<UpdateElectionBody, any>(req.body);
    res.status(200).json(await settingsService.updateDate(id, election));
  } catch (error) {
    next(error);
  }
};

const archive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
  
      res.status(200).json(await settingsService.archive(id));
    } catch (error) {
      next(error);
    }
};

const closeElection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await settingsService.closeElection(id));
  } catch (error) {
    next(error);
  }
};

const settingsController = {
    updateGeneral,
    updateDate,
    archive,
    closeElection,
  };

export default settingsController;