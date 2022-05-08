import axios from "axios";
import { performance } from "perf_hooks";
import configs from "../../configs";
import { HttpException } from "../../helpers/errors/http.exception";
import {
  decryptPin,
  encryptPin,
  validatePassword,
} from "../../helpers/password.helper";
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

  if (currentAttemps >= warningAttempts && currentAttemps < maxAttempts) {
    throw new HttpException(
      "BAD_REQUEST",
      SECURITY_MESSAGE.youHaveOnlyAttemps(maxAttempts - currentAttemps)
    );
  } else if (currentAttemps >= maxAttempts) {
    throw new HttpException("BAD_REQUEST", {
      attemptsError: true,
      message: SECURITY_MESSAGE.attemptsAccountLock(),
    });
  }
};

const loginAttemptGuard = async (user: User) => {
  const currentAttemps = user.failed_login_attempts;
  const maxAttempts = configs.security.login_max_attempts;

  if (currentAttemps >= maxAttempts) {
    throw new HttpException("BAD_REQUEST", {
      attemptsError: true,
      message: SECURITY_MESSAGE.attemptsAccountLock(),
    });
  }
};

const loginSuccessGuard = async (user: User) => {
  user.failed_login_attempts = 0;
  user.failed_login_time = null;

  await user.save();
  return true;
};

const verifyOtpSuccessGuard = async (user: User) => {
  user.last_loggedin_time = new Date();
  user.login_otp = null;
  user.last_resend_otp_time = null;

  await user.save();

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

const adminValidateRecaptcha = async (token: string) => {
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${configs.recaptcha.admin_secret_key}&response=${token}`
    );

    return response.data.success;
  } catch (error) {
    console.log("Captcatch ERROr", error);

    throw error;
  }
};

const plaformValidateRecaptcha = async (token: string) => {
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${configs.recaptcha.platform_secret_key}&response=${token}`
    );

    return response.data.success;
  } catch (error) {
    console.log("Captcatch ERROr", error);

    throw error;
  }
};

const TEST_pin_encrypt = async (passwords: string[]) => {
  var start = performance.now();
  console.time("Starts: ");

  const hashPassword = [];

  for (let i = 0; i < passwords.length; i++) {
    hashPassword.push(encryptPin(passwords[i]));
  }

  var end = performance.now() - start;
  console.timeEnd("End: ");
  console.log(end);
  return {
    length: passwords.length,
    hashPassword,
    start,
    end,
  };
};

const TEST_pin_decrypt = async (passwords: string[]) => {
  var start = performance.now();
  console.time("Starts: ");

  const validatePassword = [];

  // passwords.map((item) => {
  //   validatePassword.push(decryptPin(item));
  //   return item;
  // });

  for (let i = 0; i < passwords.length; i++) {
    validatePassword.push(decryptPin(passwords[i]));
  }

  var end = performance.now() - start;
  console.timeEnd("End: ");
  console.log(end);
  return {
    length: passwords.length,
    validatePassword,
    start,
    end,
  };
};

const securityServices = {
  loginAttemptsRecorder,
  loginAttemptGuard,
  loginSuccessGuard,
  reactivateUserAccount,
  adminValidateRecaptcha,
  plaformValidateRecaptcha,
  verifyOtpSuccessGuard,
  TEST_pin_encrypt,
  TEST_pin_decrypt,
};

export default securityServices;
