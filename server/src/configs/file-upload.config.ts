import express from "express";
import fileUpload from "express-fileupload";
import configs from ".";

const app = express();

const fileUploadConfig = () => {
  app.use(fileUpload(configs.fileExpress));
};

export default fileUploadConfig;
