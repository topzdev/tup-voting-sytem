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
} from "./overview.helper";
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
      .loadRelationCountAndMap("election.partiesCount", "election.party")
      .loadRelationCountAndMap("election.candidatesCount", "election.candidates")
      .loadRelationCountAndMap("election.positionsCount", "election.positions")
      .leftJoinAndSelect("election.logo", "logo")
      .leftJoinAndSelect("election.positions", "positions")
      .leftJoin("positions.candidates", "positions_candidates")
      .loadRelationCountAndMap(
        "positions.candidatesCount",
        "positions.candidates"
      )
  
      .where("election.id = :_election_id", {
        _election_id,
      });
  
    const election = (await builder.getOne()) as LaunchpadValidationData;
  
    if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");
  
    if (election.final_status !== "building")
      throw new HttpException(
        "BAD_REQUEST",
        "The election must be in building status."
      );
  
    return election;
  };

  const overviewServices = {
    getElectionDetails,
  }

  export default overviewServices;