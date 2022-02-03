import { Request, Response, NextFunction } from "express";
import overviewServices from "./overview.service";

const getElectionDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const election_id = req.params.election_id;
      res
        .status(200)
        .json(await overviewServices.getElectionDetails(parseInt(election_id)));
    } catch (error) {
      next(error);
    }
  };

  const overviewController = {
    getElectionDetails,
  };

  export default overviewController;