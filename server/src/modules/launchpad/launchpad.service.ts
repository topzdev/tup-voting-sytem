import { stat } from "fs";
import { close } from "inspector";
import { getRepository } from "typeorm";
import {
  Election,
  ElectionStatusEnum,
} from "../election/entity/election.entity";
import { finalStatusSubquery } from "./launchpad.helper";

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

const getAllElection = async (_org_id: number) => {
  const electionRepository = getRepository(Election);
  const builder = electionRepository
    .createQueryBuilder("election")
    .addSelect(finalStatusSubquery(), "status_final")
    .where("election.organization_id = orgId", { orgId: _org_id })
    .orderBy("election.created_at", "DESC");

  const items = await builder.getMany();

  const totalCount = await electionRepository.count({
    where: { organization_id: _org_id },
  });

  return {
    items,
    totalCount,
    itemsCount: items.length,
  };
};

const getElectionById = async (_election_id: number) => {
  const electionRepository = getRepository(Election);
  const builder = await electionRepository
    .createQueryBuilder("election")
    .addSelect(finalStatusSubquery(), "status_final")
    .where("election.id = electionId", { electionId: _election_id })
    .getOne();

  return builder || null;
};

const launchpadServices = {
  getElectionById,
  getAllElection,
  setElectionArchived,
  setElectionBuilding,
  setElectionCompleted,
  setElectionRunning,
  setElectionStatus,
};

export default launchpadServices;
