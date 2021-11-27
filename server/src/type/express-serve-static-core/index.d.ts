import { RequestOptions } from "http";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../../modules/user/entity/user.entity";
type PickedUser = Pick<
  User,
  "id" | "username" | "firstname" | "lastname" | "role"
>;

declare global {
  namespace Express {
    export interface Request {
      admin?: PickedUser;
      jwt?: string | JwtPayload;
    }
  }
}
