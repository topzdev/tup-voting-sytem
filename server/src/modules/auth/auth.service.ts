import {
  AdminLoginCredentials,
  SystemLoginCredentials,
  VoterLoginCredentials,
} from "./auth.inteface";
import { getRepository } from "typeorm";
import { User } from "../user/entity/user.entity";
import { validatePassword } from "../../helpers/password.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import {
  signJwtAdminPayload,
  signJwtVoterPayload,
} from "../../helpers/jwt.helper";
import { Voter } from "../voter/entity/voter.entity";
import authHelpers from "./auth.helpers";

const adminLogin = async (_credentials: AdminLoginCredentials) => {
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

  if (user.disabled)
    throw new HttpException(
      "BAD_REQUEST",
      "Account currently disabled, For more information contact your admintrator"
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

  if (voter.pin !== _credentials.pin) {
    throw new HttpException("NOT_FOUND", "Incorrect Pin");
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
};

export default authServices;
