import { getRepository } from "typeorm";
import platformLinks from "../../../configs/platform-links.config";
import { HttpException } from "../../../helpers/errors/http.exception";
import { Election } from "../../election/entity/election.entity";
import { finalStatusSubquery } from "../../launchpad/launchpad.helper";
import { Party } from "../../party/entity/party.entity";
import resultHelpers from "../../results/results.helper";
import { InitialPosition } from "../../results/results.interface";
import { publicElectionWhereQuery } from "../homepage/homepage.helpers";

const getElectionLongUrl = async (id: Election["id"]) => {
  if (!id) throw new HttpException("BAD_REQUEST", "Election id is required");

  const electionRepository = getRepository(Election);
  let electionBuilder = electionRepository.createQueryBuilder("election");

  const election = await electionBuilder
    .select([
      "election.id",
      "election.slug",
      "election.description",
      "election.title",
    ])
    .where("election.id = :id", {
      id,
    })
    .getOne();

  if (!election) throw new HttpException("NOT_FOUND", "Election not found");

  const long_url = platformLinks.voting(election.slug);

  return {
    ...election,
    long_url,
  };
};

const getElectionContent = async (slug: string) => {
  if (!slug)
    throw new HttpException("BAD_REQUEST", "Election slug is required");

  const electionRepository = getRepository(Election);
  let electionBuilder = electionRepository.createQueryBuilder("election");

  electionBuilder = electionBuilder
    .addSelect(finalStatusSubquery(electionBuilder.alias))
    .leftJoinAndSelect("election.logo", "logo")
    .leftJoinAndSelect("election.organization", "organization")
    .leftJoinAndSelect("organization.theme", "organization_theme")
    .leftJoinAndSelect("organization.logo", "organization_logo")
    .leftJoinAndSelect("election.positions", "positions")
    .leftJoinAndSelect("positions.candidates", "candidates")
    .leftJoinAndSelect("candidates.profile_photo", "candidates_profile_photo")
    .leftJoinAndSelect("candidates.party", "candidates_party")
    .leftJoinAndSelect("candidates_party.logo", "candidates_party_logo")
    .loadRelationCountAndMap("candidates.votesCount", "candidates.votes")
    .leftJoinAndSelect("election.party", "party")
    .leftJoinAndSelect("party.logo", "party_logo")
    .leftJoinAndSelect("party.cover_photo", "party_cover_photo")

    .where(publicElectionWhereQuery("election"))
    .andWhere("election.slug = :slug", {
      slug,
    })
    .orderBy({
      "positions.display_order": "ASC",
      "positions.created_at": "DESC",
    });

  const election = await electionBuilder.getOne();

  if (!election) throw new HttpException("NOT_FOUND", "Election not found");
  const positions = election.positions as InitialPosition[];

  if (
    (election.final_status === "completed" ||
      election.final_status === "archive") &&
    election.is_tally_public
  ) {
    const tally = resultHelpers.getElectionFinalTally(positions);

    return {
      tally,
      election,
    };
  } else {
    return {
      election,
    };
  }
};

const electionPublicServices = {
  getElectionContent,
  getElectionLongUrl,
};

export default electionPublicServices;
