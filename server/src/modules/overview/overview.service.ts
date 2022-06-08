import { getRepository } from "typeorm";
import platformLinks, {
  platformShortLinks,
} from "../../configs/platform-links.config";
import { HttpException } from "../../helpers/errors/http.exception";
import { Election } from "../election/entity/election.entity";
import { finalStatusSubquery } from "../launchpad/launchpad.helper";
import overviewHelpers from "./overview.helpers";
import { OverviewDetails } from "./overview.interface";

const getElectionDetails = async (_election_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .select([
      "election.id",
      "election.title",
      "election.slug",
      "election.start_date",
      "election.close_date",
      "election.status",
      "election.archive",
      "election.final_status",
      "election.is_public",
      "election.allow_pre_register",
    ])
    .addSelect(finalStatusSubquery(builder.alias))

    .loadRelationCountAndMap(
      "election.votersCount",
      "election.voters",
      "voters",
      (qb) =>
        qb.andWhere("voters.is_pre_register = :preregistered", {
          preregistered: false,
        })
    )
    .loadRelationCountAndMap("election.votesCount", "election.votes")
    .loadRelationCountAndMap("election.votedCount", "election.voted")
    .loadRelationCountAndMap("election.partiesCount", "election.party")
    .loadRelationCountAndMap("election.candidatesCount", "election.candidates")
    .loadRelationCountAndMap("election.positionsCount", "election.positions")
    .where("election.id = :_election_id", {
      _election_id,
    });

  const election = await builder.getOne();

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");

  const urls = overviewHelpers.generateElectionUrls(election);

  return { ...election, urls } as OverviewDetails;
};

const overviewServices = {
  getElectionDetails,
};

export default overviewServices;
