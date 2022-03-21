import { RequestOptions } from "http";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../../modules/user/entity/user.entity";
import { Voter } from "../../modules/voter/entity/voter.entity";
type PickedUser = Pick<
  User,
  "id" | "username" | "firstname" | "lastname" | "role"
>;

type PickedVoter = Pick<Voter, "id" | "username" | "firstname" | "lastname">;

declare global {
  namespace Express {
    export interface Request {
      admin?: PickedUser;
      admin_jwt?: string | JwtPayload;

      voter?: PickedVoter;
      voter_jwt?: string | JwtPayload;
    }
  }
}
