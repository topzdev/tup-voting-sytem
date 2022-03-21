import bodyParser from "body-parser";
import flash from "connect-flash";
import cors from "cors";
import express from "express";
import configs from "./configs";
import fileUploadConfig from "./configs/file-upload.config";
import morganConfig from "./configs/morgan.config";
import errorHandler from "./middlewares/error-handlers.middleware";
import { getClientInfo } from "./middlewares/get-client-info.middleware";
import router from "./routes";

const port = configs.port || 5000;

const app = express();

const bootsrap = async () => {
  // middlewares
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(flash());
  app.use(getClientInfo);

  fileUploadConfig(app);
  // sessionConfig(app);
  // passportConfig(app);
  morganConfig(app);

  app.get("/", (req, res) => {
    res.send("Welcome to TUP VOTING SYSTEM SERVER");
  });

  // routes
  app.use("/api/v1", router);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(
      `TUP Voting System Server was listening at http://localhost:${port}`
    );
  });
};

export default bootsrap;
