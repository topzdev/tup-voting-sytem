import { customAlphabet } from "nanoid";
import { getRepository } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import { PickedUser } from "../../type/express-serve-static-core";
import { Organization } from "../organization/entity/organization.entity";
import { Election } from "./entity/election.entity";

const generateElectionSlug = () => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 10);
  return nanoid();
};

const isEmptyStringReturnNull = (str: string) => {
  return str === "" ? null : str;
};

const electionOfficerGuard = async (user: PickedUser, election_id: number) => {
  const electionRepository = getRepository(Election);
  let election = await electionRepository
    .createQueryBuilder("election")
    .leftJoinAndSelect("election.election_officers", "election_officers")
    .leftJoinAndSelect("election_officers.user", "election_officers_user")
    .where("election.id = :election_id", {
      election_id,
    })
    .getOne();

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  const election_officer = user.election_officer;
  console.log(election, election_officer);

  if (election_officer) {
    const officers = election.election_officers;

    if (
      !officers.filter((item) => item.user && item.user.id === user.id).length
    ) {
      throw new HttpException(
        "BAD_REQUEST",
        "You are not election officer assigned in this election"
      );
    }
  }
};

const electionHelper = {
  generateElectionSlug,
  isEmptyStringReturnNull,
  electionOfficerGuard,
};

export default electionHelper;
