import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreateElectionBody,
  UpdateElectionBody,
  GetElectionBody,
} from "../election/election.interface";
import settingsService from "./settings.service";
// import electionService from "../election/election.service";
import { unflatten } from "flat";

const getOneById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
  
      res.status(200).json(await settingsService.getById(id));
    } catch (error) {
      next(error);
    }
  };

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logo = req.files
        ? (req.files.logo as fileUpload.UploadedFile)
        : undefined;
  
      const election = unflatten<UpdateElectionBody, any>(req.body);
  
      console.log(logo, election);
  
      res.status(200).json(await settingsService.update(logo, election));
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
// const getElectionBallot = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const electionId = req.params.election_id;
//     res
//       .status(200)
//       .json(await launchpadServices.getElectionBallot(parseInt(electionId)));
//   } catch (error) {
//     next(error);
//   }
// };

// const getElectionDetails = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const election_id = req.params.election_id;
//     res
//       .status(200)
//       .json(await launchpadServices.getElectionDetails(parseInt(election_id)));
//   } catch (error) {
//     next(error);
//   }
// };

// const getElectionValidations = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const election_id = req.params.election_id;
//     res
//       .status(200)
//       .json(
//         await launchpadServices.launchpadValidations(parseInt(election_id))
//       );
//   } catch (error) {
//     next(error);
//   }
// };

// const launchElection = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const election_id = req.params.election_id;
//     res
//       .status(200)
//       .json(await launchpadServices.launchElection(parseInt(election_id)));
//   } catch (error) {
//     next(error);
//   }
// };

// const getElectionById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const election_id = req.params.election_id;
//     res
//       .status(200)
//       .json(await launchpadServices.getElectionById(parseInt(election_id)));
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllElection = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const organization_id = req.params.organization_id;
//     res
//       .status(200)
//       .json(await launchpadServices.getAllElection(parseInt(organization_id)));
//   } catch (error) {
//     next(error);
//   }
// };

// const launchpadController = {
//   getElectionBallot,
//   getAllElection,
//   getElectionById,
//   getElectionDetails,
//   launchElection,
//   getElectionValidations,
// };

// export default launchpadController;
const settingsController = {
    getOneById,
    update,
    archive,
  };

export default settingsController;