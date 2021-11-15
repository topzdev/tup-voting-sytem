import { Express, Request } from "express";
import morgan from "morgan";

const morganConfig = (app: Express) => {
  morgan.token("body", (req: Request) => req.body);
  morgan.token("params", (req: Request) => {
    let paramStrings = "";

    Object.entries(req.params).forEach(([key, value]) => {
      paramStrings += `${key}: ${value}`;
    });

    return paramStrings;
  });

  app.use(morgan("dev"));
};

export default morganConfig;
