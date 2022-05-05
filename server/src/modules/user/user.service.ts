import { FindManyOptions, getRepository, ILike, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import {
  genHashedPassword,
  validatePassword,
} from "../../helpers/password.helper";
import securityServices from "../security/security.service";
import { User } from "./entity/user.entity";
import userHelper from "./user.helper";
import {
  ChangePasswordDto,
  ChangeRoleDto,
  CreateUser,
  GetUserQuery,
  UpdateUser,
} from "./user.inteface";

// const User = getRepository(User);

const getAll = async (_query: GetUserQuery) => {
  let options: FindManyOptions<User> = {};

  if (_query.search) {
    options.where = [
      { firstname: ILike(`%${_query.search}%`) },
      { lastname: ILike(`%${_query.search}%`) },
      { username: ILike(`%${_query.search}%`) },
      { email_address: ILike(`%${_query.search}%`) },
    ];
  }

  if (_query.order) {
    options.order = _query.order;
  }

  if (_query.page && _query.take) {
    options.skip = (_query.page - 1) * _query.take;
    options.take = _query.take;
  }

  const [users, count] = await User.findAndCount(options);

  console.log("Test", {
    users,
  });

  return {
    items: users,
    count,
  };
};

const getById = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", "user id is required");

  const user = await User.findOne(_id);

  return user ? user : null;
};

const create = async (_user: CreateUser) => {
  const isExist = await User.findOne({
    where: [
      {
        username: _user.username,
      },
      { email_address: _user.email_address },
    ],
  });

  if (isExist) {
    if (isExist.username === _user.username)
      throw new HttpException("BAD_REQUEST", "Username has been used");

    if (isExist.email_address === _user.email_address)
      throw new HttpException("BAD_REQUEST", "Email Address has been used");
  }

  let user = User.create({
    username: _user.username,
    firstname: _user.firstname,
    lastname: _user.lastname,
    email_address: _user.email_address,
    role: _user.role,
    password: await genHashedPassword(
      userHelper.generatePassword(_user.username, _user.lastname)
    ),
  });

  console.log(user);

  user = await user.save();

  delete user.password;

  return user;
};

const update = async (_user: UpdateUser) => {
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

const changeRole = async (_user: ChangeRoleDto) => {
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

  user.role = _user.role;

  await user.save();

  return true;
};

const resetPassword = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await User.findOne(_id);

  if (!user) throw new HttpException("NOT_FOUND", "user not found");

  const newPassword = userHelper.generatePassword(user.username, user.lastname);

  user.password = await genHashedPassword(newPassword);

  console.log(newPassword);

  await user.save();

  return true;
};

const changePassword = async (
  _id: User["id"],
  _passwords: ChangePasswordDto
) => {
  console.log(_passwords);

  if (!_id) throw new HttpException("BAD_REQUEST", `User id is required`);

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select(["user.id", "user.password"])
    .where("user.id = :userId", { userId: _id })
    .getOne();

  if (!user) throw new HttpException("NOT_FOUND", "User not found");

  if (!(await validatePassword(_passwords.currentPassword, user.password)))
    throw new HttpException(
      "BAD_REQUEST",
      "Current password doesn't match with the old password"
    );

  if (_passwords.confirmPassword !== _passwords.newPassword)
    throw new HttpException(
      "BAD_REQUEST",
      "Confirm password doesnt match with new password"
    );

  user.password = await genHashedPassword(_passwords.newPassword);

  console.log("Final User", user);

  await user.save();

  return true;
};

const disableUser = async (_id: User["id"], disabled: boolean) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await User.findOne({
    where: {
      id: _id,
    },
  });

  if (!user) throw new HttpException("NOT_FOUND", "User not found");

  console.log("Disabled ?", disabled);

  user.disabled = disabled;

  await user.save();

  return disabled;
};

const myAccount = async (_id: User["id"]) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await User.findOne({
    where: {
      id: _id,
    },
  });

  return user;
};

const remove = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await User.findOne(_id);

  await user.softRemove();

  return true;
};

const restore = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await User.findOne(_id, { withDeleted: true });

  console.log("Recovered", user);

  if (!user) throw new HttpException("NOT_FOUND", "user cannot be recovered");

  await user.recover();

  return true;
};

const reactivateAccount = async (_id: User["id"]) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `User id is required`);

  await securityServices.reactivateUserAccount(_id);

  return true;
};

const userServices = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
  changePassword,
  resetPassword,
  disableUser,
  myAccount,
  changeRole,
  reactivateAccount,
};

export default userServices;
