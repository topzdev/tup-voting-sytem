import { Brackets, getRepository, IsNull, Not } from "typeorm";
import { HttpException } from "../../../helpers/errors/http.exception";
import {
  CreateCandidateBody,
  GetCandidateBody,
  UpdateCandidateBody,
} from "../../candidate/candidate.interface";
import { Candidate } from "../../candidate/entity/candidate.entity";
import { Election } from "../../election/entity/election.entity"


const getAll = async (_electionId: string, _query: GetCandidateBody) => {
  const candidateRepository = getRepository(Candidate);
  const searchStirng = _query.search ? _query.search : "";
  const withArchive = _query.withArchive;

  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election id is required");

  let builder = candidateRepository
    .createQueryBuilder("candidate")
    .leftJoinAndSelect("candidate.party", "party")
    .leftJoinAndSelect("party.logo", "party_logo")
    .leftJoinAndSelect("candidate.position", "position")
    .leftJoinAndSelect("candidate.profile_photo", "profile_photo")
    .leftJoinAndSelect("candidate.cover_photo", "cover_photo")
    .where("candidate.election_id = :electionId", {
      electionId: _electionId,
    });

  if (!withArchive) {
    builder = builder.andWhere("candidate.archive = :bol", { bol: false });
  }
  if (searchStirng) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("candidate.firstname ILIKE :firstname", {
          firstname: `%${searchStirng}%`,
        });
        sqb.orWhere("candidate.lastname ILIKE :lastname", {
          lastname: `%${searchStirng}%`,
        });
      })
    );
  }

  if (_query.party) {
    if (_query.party === "ind") {
      builder = builder.andWhere("candidate.party_id IS NULL");
    } else if (_query.party !== "all") {
      builder = builder.andWhere("candidate.party_id = :partyId", {
        partyId: _query.party,
      });
    }
  }

  if (_query.position) {
    if (_query.position !== "all") {
      builder = builder.andWhere("candidate.position_id = :positionId", {
        positionId: _query.position,
      });
    }
  }

  builder = builder.orderBy({
    "candidate.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("candidate.firstname", _query.order);
    builder = builder.addOrderBy("candidate.lastname", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const items = await builder.getMany();
  const totalCount = await candidateRepository.count({
    where: { election_id: _electionId },
  });
  return {
    items,
    totalCount: totalCount,
    itemsCount: items.length,
  };
};

const candidateServices = {
  getAll,
};

export default candidateServices;