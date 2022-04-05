import { AdminLoginCredentials, VoterLoginCredentials } from "./auth.inteface";
import { getRepository } from "typeorm";
import { User } from "../user/entity/user.entity";
import { validatePassword } from "../../helpers/password.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import {
  signJwtAdminPayload,
  signJwtVoterPayload,
} from "../../helpers/jwt.helper";
import { Voter } from "../voter/entity/voter.entity";

const adminLogin = async (_credentials: AdminLoginCredentials) => {
  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select([
      "user.id",
      "user.firstname",
      "user.lastname",
      "user.password",
      "user.username",
      "user.role",
    ])
    .where("user.username = :userText", { userText: _credentials.username })
    .getOne();

  if (!user) return new HttpException("BAD_REQUEST", "User is not exist");

  if (!(await validatePassword(_credentials.password, user.password))) {
    return new HttpException("BAD_REQUEST", "Incorrect password");
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

const googleToken = async () => {};

const authServices = {
  adminLogin,
  voterLogin,
};

export default authServices;
