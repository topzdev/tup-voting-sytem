import configs from "../../configs";
import { HttpException } from "../../helpers/errors/http.exception";
import { User } from "../user/entity/user.entity";
import { SECURITY_MESSAGE } from "./security.helper";
import { AttemptError } from "./security.interface";

const loginAttemptsRecorder = async (user: User) => {
  const currentAttemps = user.failed_login_attempts + 1;
  const warningAttempts = 3;
  const maxAttempts = configs.security.login_max_attempts;

  user.failed_login_attempts = currentAttemps;
  user.failed_login_time = new Date();
  user.save();

  console.log(user);

  const attemptError: AttemptError = {
    failed_login_attempts: user.failed_login_attempts,
    failed_login_time: user.failed_login_time,
    max_attempts: maxAttempts,
  };

  if (currentAttemps >= warningAttempts && currentAttemps < maxAttempts) {
    throw new HttpException("BAD_REQUEST", {
      attemptError,
      message: SECURITY_MESSAGE.youHaveOnlyAttemps(
        maxAttempts - warningAttempts
      ),
    });
  } else if (currentAttemps >= maxAttempts) {
    throw new HttpException("BAD_REQUEST", {
      attemptError,
      message: SECURITY_MESSAGE.attemptsAccountLock(),
    });
  }
};

const loginAttemptGuard = async (user: User) => {
  const currentAttemps = user.failed_login_attempts;
  const maxAttempts = configs.security.login_max_attempts;

  const attemptError: AttemptError = {
    failed_login_attempts: user.failed_login_attempts,
    failed_login_time: user.failed_login_time,
    max_attempts: maxAttempts,
  };

  if (currentAttemps >= maxAttempts) {
    throw new HttpException("BAD_REQUEST", {
      attemptError,
      message: SECURITY_MESSAGE.attemptsAccountLock(),
    });
  }
};

const loginSuccessGuard = async (user: User) => {
  user.failed_login_attempts = 0;
  user.failed_login_time = null;
  user.last_loggedin_time = new Date();

  user.save();
  return true;
};

const reactivateUserAccount = async (_user_id: User["id"]) => {
  const user = await User.findOne({
    where: { id: _user_id },
  });

  if (!user) {
    throw new HttpException("NOT_FOUND", SECURITY_MESSAGE.userNotFound());
  }

  user.failed_login_attempts = 0;
  user.failed_login_time = null;
  user.reactivate_time = new Date();

  await user.save();

  return true;
};

const securityServices = {
  loginAttemptsRecorder,
  loginAttemptGuard,
  loginSuccessGuard,
  reactivateUserAccount,
};

export default securityServices;
