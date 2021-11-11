import express from "express";
const router = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;

const bootstrap = () => {
  const app = express();
  // middlewares
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    res.send("Welcome to TUP VOTING SYSTEM SERVER");
  });

  // routes
  app.use("/api/v1", router);

  app.listen(port, () => {
    console.log(
      `TUP Voting System Server was listening at http://localhost:${port}`
    );
  });
};

bootstrap();
