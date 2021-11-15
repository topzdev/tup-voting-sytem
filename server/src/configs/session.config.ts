import { TypeormStore } from "connect-typeorm/out";
import { Express } from "express";
import session from "express-session";
import { getConnection, getRepository } from "typeorm";
import { Session } from "../entity/session.entity";
import configs from "./index";

const sessionConfig = (app: Express) => {
  console.log("Session loaded");
  const sessionRepository = getConnection().getRepository(Session);
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // i day cache
      },
      store: new TypeormStore({
        cleanupLimit: 2,
      }).connect(sessionRepository),
      secret: configs.session.secret,
    })
  );
};

export default sessionConfig;
