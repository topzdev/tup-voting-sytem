import { getRepository, In } from "typeorm";
import {
  File,
  parseCsvToJson,
  parseJsontoCsv,
} from "../../helpers/csv-parser.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import { ElectionMember } from "../election/entity/election-member.entity";
import { Election } from "../election/entity/election.entity";
import { Photo } from "../photo/photo.service";
import { Voter } from "./entity/voter.entity";
import {
  AllowVotersDto,
  CreateVoterBody,
  DisallowVotersDto,
  GetVoterBody,
  GetVoterElectionDto,
  ImportVotersByCSVDto,
  ImportVotersByElectionDto,
  RemoveVotersDto,
  UpdateVoterBody,
} from "./voter.interface";

const getAll = async (_query: GetVoterBody) => {
  const voterRepository = getRepository(Voter);
  const searchStirng = _query.search ? _query.search : "";

  let builder = voterRepository.createQueryBuilder("voter");

  if (_query.org_id) {
    builder = builder.andWhere("voter.organization_id = :orgId", {
      orgId: _query.org_id,
    });
  }

  if (searchStirng) {
    builder = builder.orWhere("voter.firstname ILIKE :firstname", {
      firstname: `%${searchStirng}%`,
    });

    builder = builder.orWhere("voter.lastname ILIKE :lastname", {
      lastname: `%${searchStirng}%`,
    });
  }

  if (_query.order) {
    builder = builder.orderBy({
      "voter.firstname": _query.order,
    });
    builder = builder.orderBy({
      "voter.lastname": _query.order,
    });
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const [voters, count] = await builder.getManyAndCount();

  return {
    items: voters,
    count,
  };
};

const getByVoterId = async (_voterId: string) => {
  if (!_voterId) throw new HttpException("BAD_REQUEST", "Voter ID is required");

  const voter = await Voter.findOne({
    where: {
      voter_id: _voterId,
    },
  });

  return voter || null;
};

const isExistByVoterId = async (_slug: string) => {
  return !!(await getByVoterId(_slug));
};

const getByEmailAddress = async (_emailAddress: string) => {
  if (!_emailAddress)
    throw new HttpException("BAD_REQUEST", "Voter Email Address is required");

  const voter = await Voter.findOne({
    where: {
      email_address: _emailAddress,
    },
  });

  return voter || null;
};

const isExistByEmailAddress = async (_slug: string) => {
  return !!(await getByEmailAddress(_slug));
};

const getById = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", "Voter ID is required");

  const voter = await Voter.findOne(_id);

  console.log(voter);

  return voter || null;
};

const create = async (_voter: CreateVoterBody) => {
  if (!_voter.election_id) {
    throw new HttpException("BAD_REQUEST", "Election is required");
  }

  if (!_voter.organization_id)
    throw new HttpException("BAD_REQUEST", "Organization is required");

  const voter = Voter.create({
    firstname: _voter.firstname,
    lastname: _voter.lastname,
    email_address: _voter.email_address,
    voter_id: _voter.voter_id,
    pin: _voter.pin,
    organization_id: _voter.organization_id,
  });
  const savedVoter = await voter.save();

  const electionMember = ElectionMember.create({
    voter_id: voter.id,
    election_id: _voter.election_id,
  });

  const savedElectionMember = electionMember.save();

  console.log(savedVoter, savedElectionMember);

  return voter;
};

const update = async (_voter: UpdateVoterBody) => {
  if (!_voter.id) {
    throw new HttpException("BAD_REQUEST", "Voter ID is required");
  }

  if (!_voter.organization_id)
    throw new HttpException("BAD_REQUEST", "Organization is required");

  const curVoter = await Voter.findOne(_voter.id);

  if (!curVoter) {
    throw new HttpException("NOT_FOUND", "Voter not found");
  }

  const toUpdateVoter = Voter.merge(curVoter, {
    firstname: _voter.firstname,
    lastname: _voter.lastname,
    email_address: _voter.email_address,
    voter_id: _voter.voter_id,
    pin: _voter.pin,
    organization_id: _voter.organization_id,
  });

  await Voter.update(_voter.id, toUpdateVoter);
  return true;
};

const remove = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Voter id is required");
  }

  const voter = await Voter.findOne(_id);

  if (!voter) {
    throw new HttpException("NOT_FOUND", "Voter not found");
  }

  // Soft remove only so that we can restore it
  await voter.softRemove();

  return true;
};

const restore = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Voter id is required");
  }

  const voter = await Voter.findOne(_id, {
    withDeleted: true,
  });

  if (!voter) {
    throw new HttpException("NOT_FOUND", "Voter not found");
  }

  await voter.recover();
  return true;
};

const checkVotedOnElectionById = async (
  _electionId: number,
  _voterId: number
) => {
  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  if (!_voterId) throw new HttpException("BAD_REQUEST", "Voter ID is required");

  const data = await ElectionMember.findOne({
    where: {
      election_id: _electionId,
      voter_id: _voterId,
      is_voted: true,
    },
  });

  return data || null;
};

const importVotersByCSV = async (_file: File, _dto: ImportVotersByCSVDto) => {
  const columns = ["firstname", "lastname", "email_address", "voter_id", "pin"];

  if (!_file) throw new HttpException("BAD_REQUEST", "Please send csv");

  const data = await parseCsvToJson(_file, {});

  console.log(data, columns);

  if (!data.length)
    throw new HttpException("BAD_REQUEST", "File submitted seems empty");

  return data;
};

const importVotersByElection = async (_dto: ImportVotersByElectionDto) => {
  const electionIds = _dto.electionIds;

  if (!electionIds.from || !electionIds.to)
    throw new HttpException("BAD_REQUEST", "Election ID's are required");

  const electionMembers = await ElectionMember.find({
    where: {
      election_id: electionIds.from,
    },
    select: ["voter_id"],
  });

  if (!electionMembers.length)
    throw new HttpException("BAD_REQUEST", "No Election Members found");

  const insertedElectionMember = await ElectionMember.insert(
    electionMembers.map((item) => ({
      voter_id: item.voter_id,
      election_id: electionIds.to,
    }))
  );

  console.log(insertedElectionMember);

  return true;
};

const exportVotersToCSV = async (_electionId: number) => {
  if (!_electionId) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const election = await Election.findOne(_electionId);

  if (!election) throw new HttpException("BAD_REQUEST", "Election not found");

  const [voter, count] = await ElectionMember.findAndCount({
    where: {
      election_id: _electionId,
    },
    relations: ["voter"],
  });

  const filename = `${election.title}-${new Date()}-items-${count}.csv`;

  const data = voter.map((item) => {
    const { firstname, lastname, email_address, voter_id, pin } = item.voter;
    return { firstname, lastname, email_address, voter_id, pin };
  });

  const fields = [
    { label: "Voter ID", value: "voter_id" },
    { label: "First Name", value: "firstname" },
    { label: "Last Name", value: "lastname" },
    { label: "Email Address", value: "email_address" },
    { label: "Pin", value: "pin" },
  ];

  return {
    filename,
    file: await parseJsontoCsv(fields, data),
  };
};

const disallowVoters = async (_dto: DisallowVotersDto) => {
  if (!_dto.ids.length)
    throw new HttpException("BAD_REQUEST", "Please provide voter id's");

  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const result = await ElectionMember.update(
    {
      election_id: _dto.election_id,
      id: In(_dto.ids),
    },
    {
      is_allowed: false,
    }
  );

  return true;
};

const allowVoters = async (_dto: AllowVotersDto) => {
  if (!_dto.ids.length)
    throw new HttpException("BAD_REQUEST", "Please provide voter id's");

  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const result = await ElectionMember.update(
    {
      election_id: _dto.election_id,
      id: In(_dto.ids),
    },
    {
      is_allowed: true,
    }
  );

  return true;
};

const getVoterElections = async (_dto: GetVoterElectionDto) => {
  const electionRepository = getRepository(Election);

  if (!_dto.voter_id)
    throw new HttpException("BAD_REQUEST", "Please provide voter's id");

  let builder = electionRepository
    .createQueryBuilder("election")
    .leftJoinAndSelect("election.members", "members")
    .leftJoinAndSelect("election.logo", "logo")
    .where("election.archived = :isArchived", { isArchived: false })
    .andWhere("members.voter_id = :voterId", { voterId: _dto.voter_id })
    .andWhere("members.is_allowed = :isAllowed", { isAllowed: true });

  if (_dto.page && _dto.take) {
    const offset = _dto.page * _dto.take - _dto.take;
    builder = builder.offset(offset).limit(_dto.take);
  }

  const [elections, count] = await builder.getManyAndCount();

  return {
    elections,
    count,
  };
};

const removeVoters = async (_dto: RemoveVotersDto) => {
  if (!_dto.ids.length)
    throw new HttpException("BAD_REQUEST", "Please provide voter id's");

  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const toDeleteData = await ElectionMember.find({
    where: { id: In(_dto.ids), election_id: _dto.election_id },
    select: ["id"],
  });

  const result = await ElectionMember.softRemove(toDeleteData);

  console.log("removed voters", result);

  return true;
};

const voterServices = {
  getAll,
  getById,
  getByEmailAddress,
  getByVoterId,
  isExistByEmailAddress,
  isExistByVoterId,
  create,
  update,
  remove,
  restore,
  checkVotedOnElectionById,
  importVotersByElection,
  importVotersByCSV,
  exportVotersToCSV,
  disallowVoters,
  allowVoters,
  getVoterElections,
  removeVoters,
};

export default voterServices;
