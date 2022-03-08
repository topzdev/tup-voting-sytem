import { unflatten } from "flat";
import { stat } from "fs";
import { close } from "inspector";
import { getRepository } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import {
  Election,
  ElectionStatusEnum,
} from "../election/entity/election.entity";
import { Position } from "../position/entity/position.entity";
import {
  finalStatusSubquery,
  launchpadValidationChecker,
  validationMessages,
} from "../launchpad/launchpad.helper";
import {
  ElectionWithStatusFinal,
  LaunchpadValidation,
  LaunchpadValidationData,
  LaunchpadValidations,
} from "./overview.interface";

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
    ])
    .addSelect(finalStatusSubquery(builder.alias))

    .loadRelationCountAndMap("election.votersCount", "election.voters")
    .loadRelationCountAndMap("election.votesCount", "election.votes")
    .loadRelationCountAndMap("election.partiesCount", "election.party")
    .loadRelationCountAndMap("election.candidatesCount", "election.candidates")
    .loadRelationCountAndMap("election.positionsCount", "election.positions")
    .where("election.id = :_election_id", {
      _election_id,
    });

  const election = (await builder.getOne()) as LaunchpadValidationData;

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");

  return election;
};

const overviewServices = {
  getElectionDetails,
};

export default overviewServices;
