import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import photoServices from "./photo.service";

const uploadTester = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const photo = req.files.photo as fileUpload.UploadedFile;
    console.log(photo);
    // res.status(200).json(await photoServices.uploadTest(req.files));
    res.status(200).json(await photoServices.uploadTest(photo));
  } catch (error) {
    next(error);
  }
};

const photoController = {
  uploadTester,
};

export default photoController;
