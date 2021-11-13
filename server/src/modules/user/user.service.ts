import bcrypt from "bcrypt";
import { FindManyOptions, getRepository, ILike } from "typeorm";
import configs from "../../configs/configs";
import { HttpException } from "../../helpers/errors/http.exception";
import { User } from "./entity/user.entity";
import { CreateUser, GetUserQuery, UpdateUser } from "./user.inteface";

const userRepository = getRepository(User);

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

  const users = await userRepository.findAndCount(options);

  return users;
};

const getById = async (id: number) => {
  const user = await userRepository.findOne({ id });

  return user;
};

const create = async (_user: CreateUser) => {
  const hash = await bcrypt.hash(_user.password, configs.auth.saltRounds);

  console.log(hash);

  const user = await userRepository.create(_user);
  user.password = hash;

  console.log(user);

  return await userRepository.save(user);
};

const update = async (_user: UpdateUser) => {
  if (!_user.id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await userRepository.findOneOrFail(_user.id);

  if (!user) throw new HttpException("NOT_FOUND", "user not found");

  user.firstname = _user.firstname;
  user.lastname = _user.lastname;
  user.role = _user.role;

  await userRepository.save(user);

  return true;
};

const remove = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await userRepository.softDelete(_id);

  return user;
};

const restore = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", `user id is required`);

  const user = await userRepository.restore(_id);

  return user;
};

const userServices = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
};

export default userServices;
