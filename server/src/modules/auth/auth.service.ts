import {
  AdminLoginCredentials,
  DisabledError,
  ResendAdminLoginOTP,
  SystemLoginCredentials,
  VerfiyAdminLoginOTP,
  VoterLoginCredentials,
} from "./auth.inteface";
import { getRepository } from "typeorm";
import { User } from "../user/entity/user.entity";
import { validatePassword, validatePin } from "../../helpers/password.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import {
  signJwtAdminPayload,
  signJwtVoterPayload,
} from "../../helpers/jwt.helper";
import { Voter } from "../voter/entity/voter.entity";
import authHelpers, { generateOTP } from "./auth.helpers";
import configs from "../../configs";
import securityServices from "../security/security.service";
import mailerServices from "../mailer/mailer.service";
import dayjs from "dayjs";

const otp_resend_interval = configs.security.otp_resend_interval;

const adminLogin = async (_credentials: AdminLoginCredentials) => {
  const recaptachaToken = _credentials.token;

  if (!recaptachaToken) {
    throw new HttpException("BAD_REQUEST", "Recaptcha token is required");
  }

  if (!(await securityServices.adminValidateRecaptcha(recaptachaToken))) {
    throw new HttpException("BAD_REQUEST", "Invalid recaptcha token");
  }

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select([
      "user.id",
      "user.firstname",
      "user.lastname",
      "user.password",
      "user.username",
      "user.email_address",
      "user.disabled",
      "user.role",
      "user.failed_login_attempts",
      "user.failed_login_time",
      "user.last_loggedin_time",
      "user.login_otp",
      "user.last_resend_otp_time",
    ])
    .where(
      "user.username = :usernameOrEmail OR user.email_address = :usernameOrEmail",
      { usernameOrEmail: _credentials.usernameOrEmail }
    )
    .getOne();

  if (!user) throw new HttpException("BAD_REQUEST", "User is not exist");

  if (user.disabled) {
    throw new HttpException("BAD_REQUEST", {
      disabledError: true,
      message:
        "Account currently disabled, For more information contact your admintrator",
    });
  }

  await securityServices.loginAttemptGuard(user);

  const userPassword = user.password;

  delete user.password;

  if (!(await validatePassword(_credentials.password, userPassword))) {
    await securityServices.loginAttemptsRecorder(user);
    throw new HttpException("BAD_REQUEST", "Incorrect password");
  }

  user.login_otp = generateOTP();

  await user.save();

  mailerServices.sendAdminLoginOTP({
    email_address: user.email_address,
    firstname: user.firstname,
    lastname: user.lastname,
    login_otp: user.login_otp,
  });

  delete user.login_otp;

  if (!user.last_resend_otp_time) {
    await securityServices.loginSuccessGuard(user);
  }

  return {
    user: {
      id: user.id,
      email_address: user.email_address,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    last_resend_otp_time: user.last_resend_otp_time,
    otp_resend_interval,
  };
};

const verifyAdminLoginOTP = async (dto: VerfiyAdminLoginOTP) => {
  if (!dto.user_id)
    throw new HttpException(
      "BAD_REQUEST",
      "Please login first, before verifying OTP"
    );

  if (!dto.otp) throw new HttpException("BAD_REQUEST", "OTP is required");

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select([
      "user.id",
      "user.firstname",
      "user.lastname",
      "user.password",
      "user.username",
      "user.email_address",
      "user.disabled",
      "user.role",
      "user.failed_login_attempts",
      "user.failed_login_time",
      "user.last_loggedin_time",
      "user.login_otp",
    ])
    .where("user.id = :user_id", { user_id: dto.user_id })
    .getOne();

  await securityServices.loginAttemptGuard(user);

  if (!user) throw new HttpException("BAD_REQUEST", "User is not exist");

  if (!user.login_otp)
    throw new HttpException(
      "BAD_REQUEST",
      "Please login first, before verifying OTP"
    );

  if (dto.otp !== user.login_otp) {
    await securityServices.loginAttemptsRecorder(user);
    throw new HttpException("BAD_REQUEST", "OTP is incorrect");
  }

  const { token, expiresIn } = signJwtAdminPayload(user);

  delete user.password;

  await securityServices.verifyOtpSuccessGuard(user);

  return {
    token,
    user,
    expiresIn,
  };
};

const resendAdminLoginOTP = async (dto: ResendAdminLoginOTP) => {
  if (!dto.user_id)
    throw new HttpException("BAD_REQUEST", "User ID is required");

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select([
      "user.id",
      "user.firstname",
      "user.lastname",
      "user.password",
      "user.username",
      "user.email_address",
      "user.disabled",
      "user.login_otp",
      "user.last_resend_otp_time",
    ])
    .where("user.id = :user_id", { user_id: dto.user_id })
    .getOne();

  if (user.last_resend_otp_time) {
    const last_resend = dayjs(user.last_resend_otp_time);
    const current_datetime = dayjs();
    const second_diff = current_datetime.diff(last_resend, "second");

    if (second_diff <= otp_resend_interval) {
      throw new HttpException(
        "BAD_REQUEST",
        "Please wait more seconds before requesting again."
      );
    }
  }

  user.login_otp = generateOTP();
  user.last_resend_otp_time = new Date();

  await user.save();

  mailerServices.sendAdminLoginOTP({
    email_address: user.email_address,
    firstname: user.firstname,
    lastname: user.lastname,
    login_otp: user.login_otp,
  });

  return {
    user: {
      id: user.id,
      email_address: user.email_address,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    last_resend_otp_time: user.last_resend_otp_time,
    otp_resend_interval,
  };
};

const systemLogin = async (_credentials: SystemLoginCredentials) => {
  console.log("System Login", _credentials);

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select([
      "user.id",
      "user.firstname",
      "user.lastname",
      "user.password",
      "user.username",
      "user.email_address",
      "user.disabled",
      "user.role",
    ])
    .where(
      "user.username = :usernameOrEmail OR user.email_address = :usernameOrEmail",
      { usernameOrEmail: _credentials.usernameOrEmail }
    )
    .getOne();

  if (!user) throw new HttpException("BAD_REQUEST", "User is not exist");

  console.log("User Fetched", user);

  if (user.disabled)
    throw new HttpException("BAD_REQUEST", "Account is currently disabled");

  if (_credentials.allowedRole && user.role !== _credentials.allowedRole)
    throw new HttpException(
      "BAD_REQUEST",
      "Account not allowed in this action"
    );

  if (!(await validatePassword(_credentials.password, user.password))) {
    throw new HttpException("BAD_REQUEST", "Incorrect password");
  }

  delete user.password;

  const { token, expiresIn } = signJwtAdminPayload(user);

  return {
    token,
    user,
    expiresIn,
  };
};

const voterLogin = async (_credentials: VoterLoginCredentials) => {
  const recaptachaToken = _credentials.token;

  if (!recaptachaToken) {
    throw new HttpException("BAD_REQUEST", "Recaptcha token is required");
  }

  if (!(await securityServices.plaformValidateRecaptcha(recaptachaToken))) {
    throw new HttpException("BAD_REQUEST", "Invalid recaptcha token");
  }

  const voter = await getRepository(Voter)
    .createQueryBuilder("voter")
    .select([
      "voter.id",
      "voter.firstname",
      "voter.lastname",
      "voter.username",
      "voter.pin",
      "voter.is_allowed",
      "voter.election_id",
    ])
    .where("voter.username = :voter_id AND voter.election_id = :election_id", {
      voter_id: _credentials.voter_id,
      election_id: _credentials.election_id,
    })
    .getOne();

  console.log(voter);

  if (!voter) {
    throw new HttpException("NOT_FOUND", "Voter is not exist");
  }

  if (!validatePin(voter.pin, _credentials.pin)) {
    if (_credentials.pin !== voter.pin) {
      throw new HttpException("NOT_FOUND", "Incorrect Pin");
    }
  }

  delete voter.pin;

  const { token, expiresIn } = signJwtVoterPayload(voter);

  return {
    token,
    expiresIn,
    voter,
  };
};

const authServices = {
  adminLogin,
  voterLogin,
  systemLogin,
  verifyAdminLoginOTP,
  resendAdminLoginOTP,
};

export default authServices;
