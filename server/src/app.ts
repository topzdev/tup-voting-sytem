import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import fileUploadConfig from "./configs/file-upload.config";
import passportConfig from "./configs/passport.config";
import sessionConfig from "./configs/session.config";
import errorHandler from "./middlewares/error-handlers.middleware";
import router from "./routes";

const port = 3000;

const app = express();

const bootsrap = async () => {
  // middlewares
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  fileUploadConfig();
  sessionConfig();
  passportConfig();

  app.use(morgan("dev"));

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
