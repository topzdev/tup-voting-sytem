import { validate } from "class-validator";
import { Brackets, getRepository, Not } from "typeorm";
import { HttpException } from "../../../helpers/errors/http.exception";
import photoUploader from "../../../helpers/photo-uploader.helper";
import { Photo } from "../../photo/photo.service";
import { Party } from "../../party/entity/party.entity";
import {
  CreatePartyBody,
  GetPartyBody,
  UpdatePartyBody,
} from "../../party/party.interface";
import { PartyLogo } from "../../party/entity/party-logo.entity";
import { PartyCoverPhoto } from "../../party/entity/party-cover-photo.entity";

const getAll = async (_electionId: string, _query: GetPartyBody) => {
  const partyRepository = getRepository(Party);
  const searchStirng = _query.search ? _query.search : "";
  const withArchive = _query.withArchive;

  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election id is required");

  let builder = partyRepository
    .createQueryBuilder("party")
    .leftJoinAndSelect("party.election", "election")
    .where("party.election_id = :electionId", {
      electionId: _electionId,
    })
    .andWhere("election.is_public = :isPublic", {
      isPublic: true,
    })
    .leftJoinAndSelect("party.logo", "logo")
    .leftJoinAndSelect("party.cover_photo", "cover");

  if (!withArchive) {
    builder = builder.andWhere("party.archive = :bol", { bol: false });
  }

  if (searchStirng) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("party.ticker ILIKE :ticker", {
          ticker: `%${searchStirng}%`,
        });
        sqb.orWhere("party.title ILIKE :title", {
          title: `%${searchStirng}%`,
        });
      })
    );
  }

  builder = builder.orderBy({
    "party.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("party.title", _query.order);
    builder = builder.addOrderBy("party.ticker", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const items = await builder.getMany();

  const totalCount = await partyRepository.count({
    where: { election_id: _electionId },
  });

  return {
    items,
    totalCount,
    itemsCount: items.length,
  };
};

const partyService = {
  getAll,
};

export default partyService;