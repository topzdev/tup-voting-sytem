import { User } from "../user/entity/user.entity";

export type AttemptError = {
  failed_login_attempts: User["failed_login_attempts"];
  failed_login_time: User["failed_login_time"];
  max_attempts: number;
};
