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
      const election_id = req.params.election_id;
      const logo = req.files
        ? (req.files.logo as fileUpload.UploadedFile)
        : undefined;
  
      const election = unflatten<UpdateElectionBody, any>(req.body);
  
      console.log(logo, election);
  
      res.status(200).json(await settingsService.updateGeneral(logo, election, parseInt(election_id)));
      
    } catch (error) {
      next(error);
    }
  }; 

const updateDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const election_id = req.params.election_id;
    const election = unflatten<UpdateElectionBody, any>(req.body);
    res.status(200).json(await settingsService.updateDate(election, parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const archive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const election_id = req.params.election_id;
  
      res.status(200).json(await settingsService.archive(parseInt(election_id)));
    } catch (error) {
      next(error);
    }
};

const unArchive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const election_id = req.params.election_id;

    res.status(200).json(await settingsService.unArchive(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const closeElection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const election_id = req.params.election_id;

    res.status(200).json(await settingsService.closeElection(parseInt(election_id)));
  } catch (error) {
    next(error);
  }
};

const settingsController = {
    updateGeneral,
    updateDate,
    archive,
    unArchive,
    closeElection,
  };

export default settingsController;