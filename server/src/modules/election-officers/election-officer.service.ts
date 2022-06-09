import { Brackets, getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import { genHashedPassword } from "../../helpers/password.helper";
import { User } from "../user/entity/user.entity";
import userHelper from "../user/user.helper";
import { UserRole } from "../user/user.inteface";
import {
  CreateElectionOfficerDto,
  GetElectionOfficerQuery,
  GetOfficerByIdDto,
  UpdateElectionOfficerDto,
} from "./election-officer.inteface";
import { ElectionOfficer } from "./entity/election-offcer.entity";

// const User = getRepository(User);

const fieldsNeeded = [
  "user.id",
  "user.firstname",
  "user.lastname",
  "user.username",
  "user.role",
  "user.disabled",
  "user.email_address",
  "election_officer.id",
  "election_officer.election_id",
];

const getOfficers = async (_query: GetElectionOfficerQuery) => {
  const userRepository = getRepository(User);
  const election_id = _query.election_id;

  if (!election_id)
    throw new HttpException("BAD_REQUEST", "Election ID is required");

  let builder = userRepository
    .createQueryBuilder("user")
    .select(fieldsNeeded)
    .leftJoinAndSelect("user.election_officer", "election_officer")
    .where(
      "user.role = :role AND election_officer.election_id = :election_id",
      {
        role: UserRole["ELECTION_OFFICER"],
        election_id: election_id,
      }
    );

  if (_query.search) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("user.firstname ILIKE :firstname", {
          firstname: _query.search,
        });
        sqb.orWhere("user.lastname ILIKE :lastname", {
          lastname: _query.search,
        });
        sqb.orWhere("user.username ILIKE :username", {
          username: _query.search,
        });
        sqb.orWhere("user.email_address ILIKE :email_address", {
          email_address: _query.search,
        });
      })
    );
  }

  builder = builder.orderBy({
    "user.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("user.firstname", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const [items, count] = await builder.getManyAndCount();

  return {
    items,
    count,
    itemsCount: items.length,
  };
};

const getOfficerById = async (dto: GetOfficerByIdDto) => {
  const userRepository = getRepository(User);
  if (!dto.user_id)
    throw new HttpException("BAD_REQUEST", "user id is required");

  let builder = userRepository.createQueryBuilder("user");

  builder = builder
    .select(fieldsNeeded)
    .leftJoinAndSelect("user.election_officer", "election_officer")
    .where(
      "user.id = :user_id AND user.role = :role AND election_officer.election_id = :election_id",
      {
        role: UserRole["ELECTION_OFFICER"],
        user_id: dto.user_id,
        election_id: dto.election_id,
      }
    );

  const user = await builder.getOne();

  return user ? user : null;
};

const create = async (dto: CreateElectionOfficerDto) => {
  const isExist = await User.findOne({
    where: [
      {
        username: dto.username,
      },
      { email_address: dto.email_address },
    ],
  });

  if (isExist) {
    if (isExist.username === dto.username)
      throw new HttpException("BAD_REQUEST", "Username has been used");

    if (isExist.email_address === dto.email_address)
      throw new HttpException("BAD_REQUEST", "Email Address has been used");
  }

  let election_officer = ElectionOfficer.create({
    election_id: dto.election_id,
  });

  await election_officer.save();

  let user = User.create({
    username: dto.username,
    firstname: dto.firstname,
    lastname: dto.lastname,
    email_address: dto.email_address,
    role: UserRole["ELECTION_OFFICER"],
    password: await genHashedPassword(
      userHelper.generatePassword(dto.username, dto.lastname)
    ),
    election_officer,
  });

  console.log(user);

  user = await user.save();

  delete user.password;

  return user;
};

const update = async (_user: UpdateElectionOfficerDto) => {
  const userRepository = getRepository(User);
  console.log(_user);

  if (!_user.id) throw new HttpException("BAD_REQUEST", `user id is required`);

  let builder = userRepository.createQueryBuilder("user");

  const user = await builder
    .where("user.id = :userId", {
      userId: _user.id,
    })
    .getOne();

  if (!user) throw new HttpException("NOT_FOUND", "user not found");

  let toUpdateEmailAddress = user.email_address;

  if (user.email_address !== _user.email_address) {
    const emailExist = await User.findOne({
      where: {
        id: Not(_user.id),
        email_address: _user.email_address,
      },
    });

    if (emailExist) {
      throw new HttpException("BAD_REQUEST", "Email address has been used");
    }

    toUpdateEmailAddress = _user.email_address;
  }

  let toUpdateUsername = _user.username;

  if (user.username !== _user.username) {
    const usernameExist = await User.findOne({
      where: {
        id: Not(_user.id),
        username: _user.username,
      },
    });

    if (usernameExist) {
      throw new HttpException("BAD_REQUEST", "Username has been used");
    }

    toUpdateUsername = _user.username;
  }

  const toUpdateUser = User.merge(user, {
    firstname: _user.firstname,
    lastname: _user.lastname,
    username: toUpdateUsername,
    email_address: toUpdateEmailAddress,
  });

  await toUpdateUser.save();

  return true;
};

const userServices = {
  getOfficers,
  getOfficerById,
  create,
  update,
};

export default userServices;
