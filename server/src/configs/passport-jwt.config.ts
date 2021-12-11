import passport from "passport";
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions as JWTStrategyOptions,
  JwtFromRequestFunction,
  VerifyCallback,
} from "passport-jwt";
import configs from ".";
import { User } from "../modules/user/entity/user.entity";
import { getRepository } from "typeorm";

const options: JWTStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: configs.jwt.admin.secret,
};

const verifyJWTPassportAsync: VerifyCallback = (jwt_payload, done) => {
  User.findOne(jwt_payload.sub.id);
};

const passportJWTConfig = async (app) => {
  passport.use("admin", new JWTStrategy(options, verifyJWTPassportAsync));

  app.use(passport.initialize());
};
