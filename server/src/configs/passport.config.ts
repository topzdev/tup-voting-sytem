import passport from "passport";
import { validatePassword } from "../helpers/password.helper";
import { User } from "../modules/user/entity/user.entity";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import express from "express";
import { getRepository } from "typeorm";

const app = express();

const verifyPassport: VerifyFunction = async (username, password, done) => {
  try {
    if (!username)
      return done(null, false, { message: "Username is required" });

    const user = await getRepository(User)
      .createQueryBuilder()
      .select("username", username)
      .addSelect("password")
      .getOne();

    console.log(user);

    if (!user) return done(null, false, { message: "Incorrect username" });

    if (!(await validatePassword(password, user.password))) {
      return done(null, false, { message: "Incorrect password" });
    }

    return done(null, user, {
      message: "Logged in Succesfully",
    });
  } catch (error) {
    return done(error);
  }
};

const serializeUser = async (user, done) => {
  console.log("SerializedUserr", user);
  done(null, user.id);
};

const deserializeUser = async (id, done) => {
  console.log("DeserializedUser:", id);
  try {
    const user = User.findOne(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
};

const passportConfig = () => {
  console.log("passport config loaded");

  passport.use(new LocalStrategy(verifyPassport));

  passport.serializeUser(serializeUser);

  passport.deserializeUser(deserializeUser);

  app.use(passport.initialize());
  app.use(passport.session());
};

export default passportConfig;
