import { RequestOptions } from "http";
import { JwtPayload, Jwt } from "jsonwebtoken";
import { PickedUser, PickedVoter } from "../express-serve-static-core";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    admin?: PickedUser;
    voter?: PickedVoter;
  }
}
