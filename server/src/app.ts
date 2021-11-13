import express from "express";
import bodyParser from "body-parser";
import router from "./routes";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";

const port = 3000;

const app = express();

const boostrap = () => {
  // middlewares
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

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

export default boostrap;
