import { getRepository } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import authHelpers from "../auth/auth.helpers";
import { Election } from "../election/entity/election.entity";
import { finalStatusSubquery } from "../launchpad/launchpad.helper";
import { Voter } from "../voter/entity/voter.entity";
import preregisterHelpers, { PREREGISTER_MESSAGES } from "./preregister.helper";
import { PreRegisterVoterInfo } from "./preregister.interface";

const getElection = async (_slug: string) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .leftJoinAndSelect("election.organization", "organization")
    .leftJoinAndSelect("election.logo", "logo")
    .leftJoinAndSelect("organization.theme", "organization_theme")
    .where(
      "election.slug = :_slug AND election.status != '1' AND election.allow_pre_register = :is_preregister AND election.final_status = 'preview'",
      { _slug, is_preregister: true }
    );

  const election = await builder.getOne();

  return {
    election: election || null,
  };
};

const getVoterInfo = async (code: string) => {
  const { access_token, id_token } = await preregisterHelpers.getGoogleTokens(
    code
  );

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
  const voter = await Voter.findOne({
    select: ["email_address", "firstname", "lastname", "id", "is_pre_register"],
    where: {
      email_address: _voterInfo.email_address,
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

  const register = Voter.create({
    firstname: _voterInfo.firstname,
    lastname: _voterInfo.lastname,
    email_address: _voterInfo.email_address,
    google_id: _voterInfo.google_id,
    election_id: _voterInfo.election_id,
  });

  return await register.save();
};

const preregisterServices = {
  getElection,
  isRegistered,
  preRegisterVoter,
  getVoterInfo,
};

export default preregisterServices;
