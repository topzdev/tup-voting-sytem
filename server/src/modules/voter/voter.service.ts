import { exit } from "process";
import { Brackets, getConnection, getRepository, In, Not } from "typeorm";
import {
  File,
  parseCsvToJson,
  parseJsontoCsv,
} from "../../helpers/csv-parser.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import { ElectionVoted } from "../voting/entity/voted.entity";
import { Election } from "../election/entity/election.entity";
import { Organization } from "../organization/entity/organization.entity";
import { Photo } from "../photo/photo.service";
import { Voter } from "./entity/voter.entity";
import voterHelpers, {
  exportCSVDetailedError,
  generateCredentials,
} from "./voter.helper";
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
import { genHashedPassword } from "../../helpers/password.helper";
import mailerServices from "../mailer/mailer.service";

/*  
!IMPORTANT
treat voter_id as username not a primary key
username is a column on entity 

but accept username as voter_id
always return voter_id not username  client side
*/

const getAll = async (_electionId: string, _query: GetVoterBody) => {
  const voterRepository = getRepository(Voter);
  const searchStirng = _query.search ? _query.search : "";

  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election id is required");

  let builder = voterRepository
    .createQueryBuilder("voter")
    .leftJoinAndSelect("voter.voted", "voted")
    .where(
      "voter.election_id = :electionId AND voter.is_pre_register = :is_pre_register",
      {
        electionId: _electionId,
        is_pre_register: false,
      }
    );

  if (searchStirng) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("voter.firstname ILIKE :firstname", {
          firstname: `%${searchStirng}%`,
        });
        sqb.orWhere("voter.lastname ILIKE :lastname", {
          lastname: `%${searchStirng}%`,
        });
        sqb.orWhere("voter.username ILIKE :username", {
          username: `%${searchStirng}%`,
        });
        sqb.orWhere("voter.email_address ILIKE :email_address", {
          email_address: `%${searchStirng}%`,
        });
      })
    );
  }

  builder = builder.orderBy({
    "voter.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("voter.firstname", _query.order);
    builder = builder.addOrderBy("voter.lastname", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  builder = builder.addSelect([
    "voter.firstname",
    "voter.lastname",
    "voter.created_at",
    "voter.deleted_at",
    "voter.id",
    "voter.username",
    "voter.email_address",
    "voter.is_allowed",
    "voter.election_id",
    "voter.archive",
    "voter.is_pre_register",
  ]);

  const items = await builder.getMany();

  const totalCount = await voterRepository.count({
    where: { election_id: _electionId },
  });

  return {
    items,
    totalCount,
    itemsCount: items.length,
  };
};

const getAllPreRegistered = async (
  _electionId: string,
  _query: GetVoterBody
) => {
  const voterRepository = getRepository(Voter);
  const searchStirng = _query.search ? _query.search : "";

  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election id is required");

  let builder = voterRepository
    .createQueryBuilder("voter")
    .leftJoinAndSelect("voter.voted", "voted")
    .where(
      "voter.election_id = :electionId AND voter.is_pre_register = :is_pre_register",
      {
        electionId: _electionId,
        is_pre_register: true,
      }
    );

  if (searchStirng) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("voter.firstname ILIKE :firstname", {
          firstname: `%${searchStirng}%`,
        });
        sqb.orWhere("voter.lastname ILIKE :lastname", {
          lastname: `%${searchStirng}%`,
        });
        sqb.orWhere("voter.username ILIKE :username", {
          username: `%${searchStirng}%`,
        });
        sqb.orWhere("voter.email_address ILIKE :email_address", {
          email_address: `%${searchStirng}%`,
        });
      })
    );
  }

  builder = builder.orderBy({
    "voter.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("voter.firstname", _query.order);
    builder = builder.addOrderBy("voter.lastname", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  builder = builder.addSelect([
    "voter.firstname",
    "voter.lastname",
    "voter.created_at",
    "voter.deleted_at",
    "voter.id",
    "voter.username",
    "voter.email_address",
    "voter.is_allowed",
    "voter.election_id",
    "voter.archive",
    "voter.is_pre_register",
  ]);

  const items = await builder.getMany();

  const totalCount = await voterRepository.count({
    where: { election_id: _electionId },
  });

  return {
    items,
    totalCount,
    itemsCount: items.length,
  };
};

const grantPreRegister = async (
  _election_id: number,
  _voters_ids: string[]
) => {
  if (!_election_id)
    throw new HttpException("BAD_REQUEST", "Election id is required");

  if (!_voters_ids.length)
    throw new HttpException("BAD_REQUEST", "Voter id's is required");

  const voterRepository = getRepository(Voter);
  const electionRepository = getRepository(Election);

  const electionBuilder = electionRepository.createQueryBuilder("election");
  const voterBuilder = voterRepository.createQueryBuilder("voter");

  const election = await electionBuilder.where({ id: _election_id }).getOne();

  if (!_election_id) throw new HttpException("NOT_FOUND", "Election not found");

  const save = await voterBuilder
    .update()
    .set({
      is_pre_register: false,
    })
    .where({
      id: In(_voters_ids),
    })
    .execute();

  const voters = await voterBuilder
    .where({
      id: In(_voters_ids),
    })
    .getMany();

  console.log(voters);

  await mailerServices.sendPreRegisterApproved(
    voters.map((item) => ({
      email_address: item.email_address,
      firstname: item.firstname,
      lastname: item.lastname,
      title: election.title,
    }))
  );

  return true;
};

const getByVoterId = async (_voterId: string) => {
  if (!_voterId) throw new HttpException("BAD_REQUEST", "Voter ID is required");

  const voter = await Voter.findOne({
    where: {
      username: _voterId,
    },
  });

  return voter || null;
};

const isExistByVoterId = async (_voterId: string) => {
  return !!(await getByVoterId(_voterId));
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

const isExistByEmailAddress = async (_email: string) => {
  return !!(await getByEmailAddress(_email));
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

  const voterRepository = getRepository(Voter);

  const builder = voterRepository.createQueryBuilder("voter");

  builder
    .where("voter.election_id = :election_id", {
      election_id: _voter.election_id,
    })
    .andWhere(
      new Brackets((qb) => {
        qb.orWhere("voter.email_address = :email_address", {
          email_address: _voter.email_address,
        });
      })
    );

  const exist = await builder.getOne();

  // const exist = await Voter.findOne({
  //   where: [
  //     { username: _voter.username },
  //     { email_address: _voter.email_address },
  //     { election_id: _voter.election_id },
  //   ],
  // });

  if (exist) {
    if (exist.email_address === _voter.email_address) {
      throw new HttpException("BAD_REQUEST", "Email Address is already exist");
    }
  }

  const { pin, voter_id } = generateCredentials();

  const voter = Voter.create({
    firstname: _voter.firstname,
    lastname: _voter.lastname,
    email_address: _voter.email_address,
    username: voter_id,
    pin,
    election_id: _voter.election_id,
  });
  const savedVoter = await voter.save();

  return {
    exist,
    created: voter,
  };
};

const update = async (_voter: UpdateVoterBody) => {
  console.log("Updates: ", _voter);

  if (!_voter.id) {
    throw new HttpException("BAD_REQUEST", "Voter ID is required");
  }

  const curVoter = await Voter.findOne(_voter.id);

  if (!curVoter) {
    throw new HttpException("NOT_FOUND", "Voter not found");
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
    email_address: toUpdateEmail,
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

  const data = await ElectionVoted.findOne({
    where: {
      election_id: _electionId,
      username: _voterId,
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
  };

  // check if election id has value
  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election is required");
  }
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

  const duplicateEmailAddress = voterHelpers.findDuplicate(
    csvData.map((item) => item.email_address)
  );

  if (duplicateEmailAddress.length) {
    throw new HttpException(
      "BAD_REQUEST",
      `Some of email address has duplicates. Those email addresses are: [${duplicateEmailAddress.join(
        ", "
      )}]`
    );
  }
  console.log("Default Column", columns, "Columns", dataColumns);

  // adding organization_id to voters info
  const parsedVoter: any[] = csvData.map((item) => {
    const { pin, voter_id } = generateCredentials();

    return {
      ...item,
      username: voter_id,
      pin,
      election_id: _dto.election_id,
    };
  });

  const voterRepository = getRepository(Voter);

  const duplicateEntry = await voterRepository
    .createQueryBuilder("voter")
    .where(
      "voter.email_address IN(:...email_addresses) AND voter.election_id = :election_id",
      {
        email_addresses: parsedVoter.map((item) => item.email_address),
        election_id: _dto.election_id,
      }
    )
    .addSelect(["voter.id", "voter.email_address"])
    .distinctOn(["voter.email_address"])
    .getMany();

  console.log(duplicateEntry);

  if (duplicateEntry.length) {
    throw new HttpException(
      "BAD_REQUEST",
      `Some of email address is already exist. Those email addresses are: [${duplicateEntry
        .map((item) => item.email_address)
        .join(", ")}]`
    );
  }

  let voterInserted;

  // create transaction
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  // starting the transaction
  await queryRunner.startTransaction();

  console.log("Transaction started", queryRunner.isTransactionActive);

  try {
    //inserting the parse voter data and returning the saved id's
    voterInserted = await queryRunner.manager
      .createQueryBuilder(Voter, "voter")
      .insert()
      .into(Voter)
      .values(parsedVoter)
      .returning("id")
      .execute();

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
    console.log("Transaction Final", voterInserted);
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

  const electionVoters = await Voter.find({
    where: {
      election_id: electionIds.from,
    },
  });

  if (!electionVoters.length)
    throw new HttpException("BAD_REQUEST", "No Election Members found");

  const newElectionVoters = Voter.create(
    electionVoters.map((item) => ({
      firstname: item.firstname,
      lastname: item.lastname,
      email_address: item.email_address,
      pin: item.pin,
      username: item.username,
      election_id: electionIds.to,
    }))
  );

  const voterRepository = getRepository(Voter);

  const insertedElectionVoters = await voterRepository
    .createQueryBuilder()
    .insert()
    .values(newElectionVoters)
    .orIgnore('("election_id", "username") DO NOTHING')
    .execute();

  console.log(insertedElectionVoters);

  return true;
};

const exportVotersToCSV = async (_electionId: number) => {
  if (!_electionId) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const election = await Election.findOne(_electionId);

  if (!election) throw new HttpException("BAD_REQUEST", "Election not found");

  const [voter, count] = await Voter.findAndCount({
    where: {
      election_id: _electionId,
    },
  });

  const filename = `${
    election.title
  }-${Date.now()}-items-${count}.csv`.toLowerCase();

  const data = voter.map((item) => {
    const { firstname, lastname, email_address } = item;
    return { firstname, lastname, email_address };
  });

  const fields = [
    // { label: "Voter ID", value: "username" },
    { label: "First Name", value: "firstname" },
    { label: "Last Name", value: "lastname" },
    { label: "Email Address", value: "email_address" },
    // { label: "Pin", value: "pin" },
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

  const result = await Voter.update(
    {
      election_id: _dto.election_id,
      id: In(_dto.voter_ids),
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

  const result = await Voter.update(
    {
      election_id: _dto.election_id,
      id: In(_dto.voter_ids),
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
    .leftJoinAndSelect("election.voters", "voters")
    .leftJoinAndSelect("election.logo", "logo")
    .where("election.id = :electionId", { electionId: _dto.election_id })
    .andWhere("election.archive = :isArchived", { isArchived: false })
    .getOne();

  return builder || null;
};

const removeVoters = async (_dto: RemoveVotersDto) => {
  if (!_dto.voter_ids.length)
    throw new HttpException("BAD_REQUEST", "Please provide voter id's");

  if (!_dto.election_id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }

  const toDeleteData = await Voter.find({
    where: {
      election_id: _dto.election_id,
      id: In(_dto.voter_ids),
    },
    select: ["id"],
  });

  const result = await Voter.remove(toDeleteData);

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
  getElectionVoters,
  removeVoters,
  grantPreRegister,
  getAllPreRegistered,
};

export default voterServices;
