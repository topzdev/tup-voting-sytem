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
import { finalStatusSubquery } from "./launchpad.helper";
import { ElectionWithStatusFinal } from "./launchpad.interface";

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
    .leftJoinAndSelect("election.logo", "logo")
    .where("election.id = :_election_id", {
      _election_id,
    });

  const election = await builder.getOne();

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");

  if (election.final_status !== "building")
    throw new HttpException(
      "BAD_REQUEST",
      "The election must be in building status."
    );

  return {
    election,
  };
};

const getElectionBallot = async (_election_id: number) => {
  const positionRepository = getRepository(Position);
  const electionRepository = getRepository(Election);

  const election = await electionRepository.findOne(_election_id);

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");

  let builder = await positionRepository.createQueryBuilder("position");

  builder = builder
    .leftJoinAndSelect("position.candidates", "candidates")
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
};

export default launchpadServices;
