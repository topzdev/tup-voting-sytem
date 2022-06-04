import { getRepository } from "typeorm";
import { HttpException } from "../../../helpers/errors/http.exception";
import { Party } from "../../party/entity/party.entity";
import { Position } from "../../position/entity/position.entity";
import { publicElectionWhereQuery } from "../homepage/homepage.helpers";

const getPartyContent = async (party_id: Party["id"]) => {
  if (!party_id) throw new HttpException("BAD_REQUEST", "Party id is required");

  const partyRepository = getRepository(Party);
  const positionRepository = getRepository(Position);

  let partyBuilder = partyRepository
    .createQueryBuilder("party")
    .leftJoinAndSelect("party.logo", "logo")
    .leftJoinAndSelect("party.cover_photo", "cover")
    .leftJoinAndSelect("party.election", "election")
    .leftJoinAndSelect("election.organization", "organization")
    .where(publicElectionWhereQuery("election"))
    .andWhere(
      "party.id = :party_id AND election.id IS NOT NULL AND organization.id IS NOT NULL",
      {
        party_id,
      }
    );

  const party = await partyBuilder.getOne();

  if (!party) throw new HttpException("NOT_FOUND", "Party not found");

  const election_id = party.election.id;

  let positionBuilder = await positionRepository.createQueryBuilder("position");

  positionBuilder = positionBuilder
    .leftJoinAndSelect("position.candidates", "candidates")
    .leftJoinAndSelect("candidates.profile_photo", "candidates_profile_photo")
    .leftJoinAndSelect("candidates.cover_photo", "candidates_cover_photo")
    .leftJoinAndSelect("candidates.party", "candidates_party")
    .leftJoinAndSelect("candidates_party.logo", "candidates_party_logo")
    .where(
      "position.election_id = :election_id AND candidates_party.id = :party_id",
      {
        election_id,
        party_id,
      }
    )
    .orderBy({
      "position.display_order": "ASC",
      "position.created_at": "DESC",
    });

  const positions = await positionBuilder.getMany();

  return {
    ...party,
    positions,
  };
};

const partyService = {
  getPartyContent,
};

export default partyService;
