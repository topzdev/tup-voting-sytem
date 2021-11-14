import { TypeormStore } from "connect-typeorm/out";
import session from "express-session";
import { Session } from "../entity/session.entity";
import { getConnection } from "typeorm";
import configs from ".";
import express from "express";

const app = express();

const sessionConfig = async () => {
  console.log("Session loaded");
  const sessionRepository = await getConnection().getRepository(Session);
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        ttl: 86400, // 1 day before the session expire,
      }).connect(sessionRepository),
      secret: configs.session.secret,
    })
  );
};

export default sessionConfig;
