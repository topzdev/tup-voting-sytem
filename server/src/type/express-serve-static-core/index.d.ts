import { RequestOptions } from "http";
import { JwtPayload } from "jsonwebtoken";
type PickedUser = Pick<
  UserEntity,
  | "id"
  | "username"
  | "firstname"
  | "lastname"
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "role"
>;

declare global {
  namespace Express {
    export interface Request {
      admin?: PickedUser;
      jwt?: string | JwtPayload;
    }
  }
}
