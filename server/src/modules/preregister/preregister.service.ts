import { getRepository } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import authHelpers from "../auth/auth.helpers";
import { Election } from "../election/entity/election.entity";
import { finalStatusSubquery } from "../launchpad/launchpad.helper";
import { Voter } from "../voter/entity/voter.entity";
import preregisterHelpers, { PREREGISTER_MESSAGES } from "./preregister.helper";
import { PreRegisterVoterInfo } from "./preregister.interface";
import { generateCredentials } from "../voter/voter.helper";

const getElection = async (_slug: string) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .leftJoinAndSelect("election.organization", "organization")
    .leftJoinAndSelect("election.logo", "logo")
    .leftJoinAndSelect("organization.theme", "organization_theme")
    .where(
      "election.slug = :_slug AND election.allow_pre_register = :is_preregister AND election.status != '1'",
      { _slug, is_preregister: true }
    );

  const election = await builder.getOne();

  console.log("Election", election);

  const error = preregisterHelpers.generatePreRegisterElectionError(election);

  return { election: election || null, error };
};

const getVoterInfo = async (code: string) => {
  const { access_token, id_token } = await preregisterHelpers.getGoogleTokens(
    code
  );

  console.log(access_token, id_token, code);

  const userInfo = await preregisterHelpers.getGoogleUserInfo({
    access_token,
    id_token,
  });

  return userInfo;
};

const isRegistered = async ({ _election_id, _email_address }) => {
  if (!_email_address)
    throw new HttpException("BAD_REQUEST", "Email Address is required");

  const voter = await Voter.findOne({
    select: ["email_address", "firstname", "lastname", "id"],
    where: {
      email_address: _email_address,
      election_id: _election_id,
    },
  });

  return !!voter;
};

const preRegisterVoter = async (_voterInfo: PreRegisterVoterInfo) => {
  const { access_token, id_token } = await preregisterHelpers.getGoogleTokens(
    _voterInfo.code
  );

  const userInfo = await preregisterHelpers.getGoogleUserInfo({
    access_token,
    id_token,
  });

  const voter = await Voter.findOne({
    select: ["email_address", "firstname", "lastname", "id", "is_pre_register"],
    where: {
      email_address: userInfo.email,
      election_id: _voterInfo.election_id,
    },
  });

  if (voter) {
    if (voter.is_pre_register) {
      throw new HttpException(
        "BAD_REQUEST",
        PREREGISTER_MESSAGES.is_preregistered
      );
    } else {
      throw new HttpException(
        "BAD_REQUEST",
        PREREGISTER_MESSAGES.is_already_registered
      );
    }
  }

  const { pin, voter_id } = generateCredentials();

  const register = Voter.create({
    firstname: userInfo.given_name,
    lastname: userInfo.family_name,
    email_address: userInfo.email,
    google_id: userInfo.id,
    election_id: _voterInfo.election_id,
    username: voter_id,
    pin,
    is_pre_register: true,
  });
  await register.save();
  return true;
};

const preregisterServices = {
  getElection,
  isRegistered,
  preRegisterVoter,
  getVoterInfo,
};

export default preregisterServices;
