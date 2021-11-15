import { Express, NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { nextTick } from "process";
import { getRepository } from "typeorm";
import { HttpException } from "../helpers/errors/http.exception";
import { validatePassword } from "../helpers/password.helper";
import { User } from "../modules/user/entity/user.entity";

const verifyPassportAsync: VerifyFunction = (username, password, done) => {
  if (!username) return done(null, false, { message: "Username is required" });

  console.log(username, password);

  getRepository(User)
    .createQueryBuilder("user")
    .addSelect("user.id")
    .addSelect("user.username")
    .addSelect("user.password")
    .where("user.username = :userText", { userText: username })
    .getOne()
    .then(async (user) => {
      if (!user) return done(null, false, { message: "Incorrect username" });
      console.log("Username Passed", user);
      console.log(
        "Checking password",
        await validatePassword(password, user.password)
      );
      if (!(await validatePassword(password, user.password))) {
        return done(null, false, { message: "Incorrect password" });
      }
      console.log("Password Passed");

      delete user.password;

      return done(null, user, {
        message: "Logged in Succesfully",
      });
    })
    .catch((error) => {
      console.log("Error", error);
      return done(error);
    });
};

const serializeUserAsync = (user, done) => {
  console.log("SerializedUserr", user);
  done(null, user.id);
};

const deserializeUserAsnyc = (id, done) => {
  console.log("DeserializedUser:", id);
  User.findOne(id)
    .then((user) => done(null, user))
    .catch((error) => done(error));
};

const passportConfig = async (app: Express) => {
  console.log("passport config loaded");

  passport.use("admin", new LocalStrategy(verifyPassportAsync));

  passport.serializeUser(serializeUserAsync);

  passport.deserializeUser(deserializeUserAsnyc);

  app.use(passport.initialize());
  app.use(passport.session());
};

export default passportConfig;
