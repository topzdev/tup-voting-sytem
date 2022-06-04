import { getRepository } from "typeorm";
import { HttpException } from "../../../helpers/errors/http.exception";
import { Candidate } from "../../candidate/entity/candidate.entity";
import { publicElectionWhereQuery } from "../homepage/homepage.helpers";

const getCandidate = async (candidate_id: Candidate["id"]) => {
  if (!candidate_id)
    throw new HttpException("BAD_REQUEST", "Party id is required");

  const candidateRepository = getRepository(Candidate);

  let candidateBuilder = candidateRepository
    .createQueryBuilder("candidate")
    .leftJoinAndSelect("candidate.party", "party")
    .leftJoinAndSelect("party.logo", "party_logo")
    .leftJoinAndSelect("candidate.position", "position")
    .leftJoinAndSelect("candidate.election", "election")
    .leftJoinAndSelect("candidate.profile_photo", "profile_photo")
    .leftJoinAndSelect("candidate.cover_photo", "cover_photo")
    .leftJoinAndSelect("election.organization", "organization")
    .where(publicElectionWhereQuery("election"))
    .andWhere(
      "candidate.id = :candidate_id AND election.id IS NOT NULL AND organization.id IS NOT NULL",
      {
        candidate_id,
      }
    );

  const candidate = await candidateBuilder.getOne();

  if (!candidate) throw new HttpException("NOT_FOUND", "Candidate not found");

  return candidate;
};

const candidateServices = {
  getCandidate,
};

export default candidateServices;
