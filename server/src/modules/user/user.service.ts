import { FindManyOptions, getRepository, ILike } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import { genPassword, validatePassword } from "../../helpers/password.helper";
import { User } from "./entity/user.entity";
import userHelper from "./user.helper";
import {
  ChangePasswordDto,
  CreateUser,
  GetUserQuery,
  UpdateUser,
} from "./user.inteface";

// const User = getRepository(User);

const getAll = async (_query: GetUserQuery) => {
  let options: FindManyOptions<User> = {};

  if (_query.search) {
    options.where = [
      { firstname: ILike(`${_query.search}`) },
      { lastname: ILike(`${_query.search}`) },
      { lastname: ILike(`${_query.search}`) },
      { id: ILike(`${_query.search}`) },
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
    where: {
      username: _user.username,
    },
  });

  if (isExist) throw new HttpException("BAD_REQUEST", "username has been used");

  let user = User.create({
    username: _user.username,
    firstname: _user.firstname,
    lastname: _user.lastname,
    role: _user.role,
    password: await genPassword(
      userHelper.generatePassword(_user.username, _user.lastname)
    ),
  });

  console.log(user);

  user = await user.save();

  delete user.password;

  return user;
};

const update = async (_user: UpdateUser) => {
  console.log(_user);

  if (!_user.id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await User.findOne(_user.id);

  if (!user) throw new HttpException("NOT_FOUND", "user not found");

  const toUpdateUser = User.merge(user, {
    firstname: _user.firstname,
    lastname: _user.lastname,
    role: _user.role,
  });

  await toUpdateUser.save();

  return true;
};

const resetPassword = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await User.findOne(_id);

  if (!user) throw new HttpException("NOT_FOUND", "user not found");

  user.password = await genPassword(
    userHelper.generatePassword(user.username, user.lastname)
  );

  await user.save();

  return true;
};

const changePassword = async (_passwords: ChangePasswordDto) => {
  console.log(_passwords);

  if (!_passwords.userId)
    throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select(["user.id", "user.password"])
    .where("user.id = :userId", { userId: _passwords.userId })
    .getOne();

  if (!user) throw new HttpException("NOT_FOUND", "user not found");

  if (!(await validatePassword(_passwords.currentPassword, user.password)))
    throw new HttpException("BAD_REQUEST", "password doesn't match");

  if (_passwords.confirmPassword !== _passwords.newPassword)
    throw new HttpException(
      "BAD_REQUEST",
      "current password doesnt match with new password"
    );

  user.password = await genPassword(_passwords.newPassword);

  console.log("Final User", user);

  await user.save();

  return true;
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

const userServices = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
  changePassword,
  resetPassword,
};

export default userServices;
