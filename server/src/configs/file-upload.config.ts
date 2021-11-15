import { Express } from "express";
import fileUpload from "express-fileupload";
import configs from ".";

const fileUploadConfig = (app: Express) => {
  app.use(fileUpload(configs.fileExpress));
};

export default fileUploadConfig;
