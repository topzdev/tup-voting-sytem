"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const http_exception_1 = require("../../helpers/errors/http.exception");
const password_helper_1 = require("../../helpers/password.helper");
const user_entity_1 = require("./entity/user.entity");
const user_helper_1 = __importDefault(require("./user.helper"));
// const User = getRepository(User);
const getAll = (_query) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let options = {};
    if (_query.search) {
      options.where = [
        { firstname: (0, typeorm_1.ILike)(`${_query.search}`) },
        { lastname: (0, typeorm_1.ILike)(`${_query.search}`) },
        { lastname: (0, typeorm_1.ILike)(`${_query.search}`) },
        { id: (0, typeorm_1.ILike)(`${_query.search}`) },
      ];
    }
    if (_query.order) {
      options.order = _query.order;
    }
    if (_query.page && _query.take) {
      options.skip = (_query.page - 1) * _query.take;
      options.take = _query.take;
    }
    const [users, count] = yield user_entity_1.User.findAndCount(options);
    console.log("Test", {
      users,
    });
    return {
      items: users,
      count,
    };
  });
const getById = (_id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        "user id is required"
      );
    const user = yield user_entity_1.User.findOne(_id);
    return user ? user : null;
  });
const create = (_user) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_entity_1.User.findOne({
      where: {
        username: _user.username,
      },
    });
    if (isExist)
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        "username has been used"
      );
    let user = user_entity_1.User.create({
      username: _user.username,
      firstname: _user.firstname,
      lastname: _user.lastname,
      role: _user.role,
      password: yield (0, password_helper_1.genHashedPassword)(
        user_helper_1.default.generatePassword(_user.username, _user.lastname)
      ),
    });
    console.log(user);
    user = yield user.save();
    delete user.password;
    return user;
  });
const update = (_user) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(_user);
    if (!_user.id)
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        `user id is required`
      );
    const user = yield user_entity_1.User.findOne(_user.id);
    if (!user)
      throw new http_exception_1.HttpException("NOT_FOUND", "user not found");
    const toUpdateUser = user_entity_1.User.merge(user, {
      firstname: _user.firstname,
      lastname: _user.lastname,
      role: _user.role,
    });
    yield toUpdateUser.save();
    return true;
  });
const resetPassword = (_id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        `user id is required`
      );
    const user = yield user_entity_1.User.findOne(_id);
    if (!user)
      throw new http_exception_1.HttpException("NOT_FOUND", "user not found");
    user.password = yield (0, password_helper_1.genHashedPassword)(
      user_helper_1.default.generatePassword(user.username, user.lastname)
    );
    yield user.save();
    return true;
  });
const changePassword = (_passwords) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(_passwords);
    if (!_passwords.userId)
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        `user id is required`
      );
    const user = yield (0, typeorm_1.getRepository)(user_entity_1.User)
      .createQueryBuilder("user")
      .select(["user.id", "user.password"])
      .where("user.id = :userId", { userId: _passwords.userId })
      .getOne();
    if (!user)
      throw new http_exception_1.HttpException("NOT_FOUND", "user not found");
    if (
      !(yield (0, password_helper_1.validatePassword)(
        _passwords.currentPassword,
        user.password
      ))
    )
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        "password doesn't match"
      );
    if (_passwords.confirmPassword !== _passwords.newPassword)
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        "current password doesnt match with new password"
      );
    user.password = yield (0, password_helper_1.genPassword)(
      _passwords.newPassword
    );
    console.log("Final User", user);
    yield user.save();
    return true;
  });
const remove = (_id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        `user id is required`
      );
    const user = yield user_entity_1.User.findOne(_id);
    yield user.softRemove();
    return true;
  });
const restore = (_id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
      throw new http_exception_1.HttpException(
        "BAD_REQUEST",
        `user id is required`
      );
    const user = yield user_entity_1.User.findOne(_id, { withDeleted: true });
    console.log("Recovered", user);
    if (!user)
      throw new http_exception_1.HttpException(
        "NOT_FOUND",
        "user cannot be recovered"
      );
    yield user.recover();
    return true;
  });
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
exports.default = userServices;
//# sourceMappingURL=user.service.js.map
