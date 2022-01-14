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
} from "./launchpad.helper";
import {
  ElectionWithStatusFinal,
  LaunchpadValidation,
  LaunchpadValidationData,
  LaunchpadValidations,
} from "./launchpad.interface";

const finalStatus = "final_status";

const setElectionStatus = async (
  _id: number,
  _status: keyof typeof ElectionStatusEnum
) => {
  await Election.update(_id, {
    status: ElectionStatusEnum[_status],
  });

  return true;
};

const setElectionCompleted = async (_election_id: number) => {
  return await Election.update(_election_id, {
    status: ElectionStatusEnum.COMPLETED,
  });
};

const setElectionRunning = async (_election_id: number) => {
  return await Election.update(_election_id, {
    status: ElectionStatusEnum.RUNNING,
  });
};

const setElectionBuilding = async (_election_id: number) => {
  return await Election.update(_election_id, {
    status: ElectionStatusEnum.BUILDING,
  });
};

const setElectionArchived = async (_election_id: number) => {
  return await Election.update(_election_id, {
    status: ElectionStatusEnum.BUILDING,
  });
};

const getAllElection = async (_organization_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .where("election.organization_id = :_organization_id", { _organization_id })
    .orderBy("election.created_at", "DESC");

  const items = await builder.getMany();

  const totalCount = await electionRepository.count({
    where: { organization_id: _organization_id },
  });

  return {
    items,
    totalCount,
    itemsCount: items.length,
  };
};

const getElectionById = async (_election_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .where("election.id = :_election_id", { _election_id });

  const election = await builder.getOne();

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");

  return election || null;
};

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

const launchpadValidations = async (_election_id: number) => {
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

  return launchpadValidationChecker(election);
};

const getElectionBallot = async (_election_id: number) => {
  const positionRepository = getRepository(Position);
  const electionRepository = getRepository(Election);

  const election = await electionRepository.findOne(_election_id);

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");

  let builder = await positionRepository.createQueryBuilder("position");

  builder = builder
    .leftJoinAndSelect("position.candidates", "candidates")
    .leftJoinAndSelect("candidates.profile_photo", "candidates_profile_photo")
    .leftJoinAndSelect("candidates.cover_photo", "candidates_cover_photo")
    .leftJoinAndSelect("candidates.party", "candidates_party")
    .leftJoinAndSelect("candidates_party.logo", "candidates_party_logo")
    .where("position.election_id = :_election_id", { _election_id })
    .orderBy({
      "position.display_order": "ASC",
      "position.created_at": "DESC",
    });

  return await builder.getMany();
};

const launchElection = async (_election_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = await electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .where("election.id = :_election_id", {
      _election_id,
    });

  const election = (await builder.getOne()) as ElectionWithStatusFinal;

  if (election.final_status !== "building")
    throw new HttpException(
      "BAD_REQUEST",
      "The election must be in building status."
    );

  election.status = ElectionStatusEnum["RUNNING"];

  await election.save();

  return election;
};

const launchpadServices = {
  getElectionById,
  getAllElection,
  setElectionArchived,
  setElectionBuilding,
  setElectionCompleted,
  setElectionRunning,
  setElectionStatus,
  getElectionBallot,
  getElectionDetails,
  launchElection,
  launchpadValidations,
};

export default launchpadServices;
