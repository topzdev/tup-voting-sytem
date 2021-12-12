"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const http_exception_1 = require("../../helpers/errors/http.exception");
const password_helper_1 = require("../../helpers/password.helper");
const user_entity_1 = require("./entity/user.entity");
// const User = getRepository(User);
const getAll = (_query) => __awaiter(void 0, void 0, void 0, function* () {
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
    return {
        users,
        count,
    };
});
const getById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
        throw new http_exception_1.HttpException("BAD_REQUEST", "user id is required");
    const user = yield user_entity_1.User.findOne(_id);
    return {
        user: user ? user : null,
    };
});
const create = (_user) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_entity_1.User.findOne({
        where: {
            username: _user.username,
        },
    });
    if (isExist)
        throw new http_exception_1.HttpException("BAD_REQUEST", "username has been used");
    let user = user_entity_1.User.create(_user);
    user.password = yield (0, password_helper_1.genPassword)(_user.password);
    console.log(user);
    user = yield user.save();
    delete user.password;
    return user;
});
const update = (_user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(_user);
    if (!_user.id)
        throw new http_exception_1.HttpException("BAD_REQUEST", `user id is required`);
    const user = yield user_entity_1.User.findOne(_user.id);
    if (!user)
        throw new http_exception_1.HttpException("NOT_FOUND", "user not found");
    user.firstname = _user.firstname;
    user.lastname = _user.lastname;
    user.role = _user.role;
    yield user.save();
    return true;
});
const remove = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
        throw new http_exception_1.HttpException("BAD_REQUEST", `user id is required`);
    const user = yield user_entity_1.User.findOne(_id);
    yield user.softRemove();
    return true;
});
const restore = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_id)
        throw new http_exception_1.HttpException("BAD_REQUEST", `user id is required`);
    const user = yield user_entity_1.User.findOne(_id, { withDeleted: true });
    console.log("Recovered", user);
    if (!user)
        throw new http_exception_1.HttpException("NOT_FOUND", "user cannot be recovered");
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
};
exports.default = userServices;
//# sourceMappingURL=user.service.js.map