import { getConnection, getRepository, In, Not } from "typeorm";
import {
  File,
  parseCsvToJson,
  parseJsontoCsv,
} from "../../helpers/csv-parser.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import { ElectionMember } from "../election/entity/election-member.entity";
import { Election } from "../election/entity/election.entity";
import { Organization } from "../organization/entity/organization.entity";
import { Photo } from "../photo/photo.service";
import { Voter } from "./entity/voter.entity";
import { exportCSVDetailedError } from "./voter.helper";
import {
  AllowVotersDto,
  CreateVoterBody,
  DisallowVotersDto,
  GetElectionMembersDto,
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

  const exist = await Voter.findOne({
    where: [
      { voter_id: _voter.voter_id },
      { email_address: _voter.email_address },
    ],
  });

  if (exist) {
    throw new HttpException(
      "BAD_REQUEST",
      "Voter ID or Email Address is already exist"
    );
  }

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

  let toUpdateVoterId = curVoter.voter_id;

  if (_voter.voter_id !== curVoter.voter_id) {
    const voterExist = await Voter.findOne({
      where: {
        id: Not(curVoter.id),
        voter_id: _voter.voter_id,
      },
    });

    if (voterExist) {
      throw new HttpException("BAD_REQUEST", "Voter Id has been used");
    }

    toUpdateVoterId = _voter.voter_id;
  }

  let toUpdateEmail = curVoter.email_address;

  if (_voter.email_address !== curVoter.email_address) {
    const voterExist = await Voter.findOne({
      where: {
        id: Not(curVoter.id),
        email_address: _voter.email_address,
      },
    });

    if (voterExist) {
      throw new HttpException("BAD_REQUEST", "Voter Id has been used");
    }

    toUpdateEmail = _voter.email_address;
  }

  const toUpdateVoter = Voter.merge(curVoter, {
    firstname: _voter.firstname,
    lastname: _voter.lastname,
    organization_id: _voter.organization_id,
    email_address: toUpdateEmail,
    voter_id: toUpdateVoterId,
    pin: _voter.pin,
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
  // the default and standard columns wit h corresponding type which needed on csvtojson column parser should csv data return.
  const columns = {
    firstname: "string",
    lastname: "string",
    email_address: "string",
    voter_id: "string",
    pin: "string",
  };

  // check if election id has value
  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election is required");
  }

  // check if organization id has value
  if (!_dto.organization_id)
    throw new HttpException("BAD_REQUEST", "Organization is required");

  // check if organization is exist
  const isOrganizationExist = await Organization.findOne(_dto.organization_id);
  if (!isOrganizationExist)
    throw new HttpException("BAD_REQUEST", "Election is not exist");

  // check if election is exist
  const isElectionExist = await Election.findOne(_dto.election_id);
  if (!isElectionExist)
    throw new HttpException("BAD_REQUEST", "Election is not exist");

  // check if csv has value
  if (!_file) throw new HttpException("BAD_REQUEST", "Please send csv");

  // parsing the csv to json/array
  const csvData = await parseCsvToJson(_file, {
    colParser: columns,
    checkType: true,
    checkColumn: true,
  });

  console.log(csvData, columns);

  // check if parsed csv data have items
  if (!csvData.length)
    throw new HttpException("BAD_REQUEST", "File submitted seems empty");

  //extract the columns by getting the first item object keys/properites
  const dataColumns = Object.keys(csvData[0]);

  // check if the columns of parsed csv match the default/standard column
  const columnDiffs = Object.keys(columns).filter(
    (item) => !dataColumns.includes(item)
  );

  if (columnDiffs.length)
    throw new HttpException(
      "BAD_REQUEST",
      `column missing/mismatch (${columnDiffs.join(",")})`
    );

  console.log("Default Column", columns, "Columns", dataColumns);

  let voterInserted, electionMembersInserted;

  // create transaction
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  // starting the transaction
  await queryRunner.startTransaction();

  console.log("Transaction started", queryRunner.isTransactionActive);

  try {
    // adding organization_id to voters info
    const parsedVoter = csvData.map((item) => ({
      ...item,
      organization_id: _dto.organization_id,
    }));

    //inserting the parse voter data and returning the saved id's
    voterInserted = await queryRunner.manager
      .createQueryBuilder(Voter, "voter")
      .insert()
      .into(Voter)
      .values(parsedVoter)
      .returning("id")
      .execute();

    //mapping the inserted voter's id and addiing election_id on it
    const parsedElectionMembers = voterInserted.generatedMaps.map((item) => ({
      voter_id: item.id,
      election_id: _dto.election_id,
    }));

    console.log("Voter Inserted", electionMembersInserted);

    // then inserting the parse election members to database
    electionMembersInserted = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(ElectionMember)
      .values(parsedElectionMembers)
      .returning("id")
      .execute();

    console.log("Election Members Inserted", electionMembersInserted);

    // commiting the transaction
    await queryRunner.commitTransaction();
    console.log("Transaction Commited", queryRunner.isTransactionActive);

    // returning true if transaction is successful
    return true;
  } catch (error) {
    // if error occurred on transaction then rollback it
    await queryRunner.rollbackTransaction();
    console.log("Transaction Error", error);
    throw exportCSVDetailedError(error);
  } finally {
    // finalizing the transaction by releasing it
    await queryRunner.release();
    console.log("Transaction Final", voterInserted, electionMembersInserted);
  }
};

const importVotersByElection = async (_dto: ImportVotersByElectionDto) => {
  const electionIds = _dto.electionIds;

  if (!electionIds.from || !electionIds.to)
    throw new HttpException("BAD_REQUEST", "Election ID's are required");

  if (electionIds.from === electionIds.to)
    throw new HttpException(
      "BAD_REQUEST",
      "You cannot re-import this current election"
    );

  const electionMembers = await ElectionMember.find({
    where: {
      election_id: electionIds.from,
    },
    select: ["voter_id"],
  });

  if (!electionMembers.length)
    throw new HttpException("BAD_REQUEST", "No Election Members found");

  const newElectionMembers = electionMembers.map((item) => ({
    voter_id: item.voter_id,
    election_id: electionIds.to,
  }));

  const memberRepository = getRepository(ElectionMember);

  const insertedElectionMember = await memberRepository
    .createQueryBuilder()
    .insert()
    .values(newElectionMembers)
    .orIgnore('("election_id", "voter_id") DO NOTHING')
    .execute();

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

  const filename = `${
    election.title
  }-${Date.now()}-items-${count}.csv`.toLowerCase();

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
  if (!_dto.voter_ids.length)
    throw new HttpException("BAD_REQUEST", "Please provide voter id's");

  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const result = await ElectionMember.update(
    {
      election_id: _dto.election_id,
      voter_id: In(_dto.voter_ids),
    },
    {
      is_allowed: false,
    }
  );

  return true;
};

const allowVoters = async (_dto: AllowVotersDto) => {
  if (!_dto.voter_ids.length)
    throw new HttpException("BAD_REQUEST", "Please provide voter id's");

  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const result = await ElectionMember.update(
    {
      election_id: _dto.election_id,
      voter_id: In(_dto.voter_ids),
    },
    {
      is_allowed: true,
    }
  );

  return true;
};

const getElectionVoters = async (_dto: GetElectionMembersDto) => {
  const electionRepository = getRepository(Election);

  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  let builder = await electionRepository
    .createQueryBuilder("election")
    .leftJoinAndSelect("election.members", "members")
    .leftJoinAndSelect("election.logo", "logo")
    .where("election.id = :electionId", { electionId: _dto.election_id })
    .andWhere("election.archive = :isArchived", { isArchived: false })
    .getOne();

  return builder || null;
};

const getVoterElections = async (_dto: GetVoterElectionDto) => {
  const electionRepository = getRepository(Election);
  const memberRepository = getRepository(ElectionMember);
  const voterRepository = getRepository(Voter);

  if (!_dto.voter_id)
    throw new HttpException("BAD_REQUEST", "Please provide voter's id");

  let builder = electionRepository
    .createQueryBuilder("election")
    .leftJoin("election.members", "members")
    .leftJoinAndSelect("election.logo", "logo")
    .where("election.archive = :isArchived", { isArchived: false })
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
  if (!_dto.voter_ids.length)
    throw new HttpException("BAD_REQUEST", "Please provide voter id's");

  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const toDeleteData = await ElectionMember.find({
    where: {
      election_id: _dto.election_id,
      voter_id: In(_dto.voter_ids),
    },
    select: ["id"],
  });

  const result = await ElectionMember.remove(toDeleteData);

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
  getElectionVoters,
  removeVoters,
};

export default voterServices;
