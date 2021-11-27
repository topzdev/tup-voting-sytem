import { AdminLoginCredentials } from "./auth.inteface";
import { getRepository } from "typeorm";
import { User } from "../user/entity/user.entity";
import { validatePassword } from "../../helpers/password.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import { signJwtAdminPayload } from "../../helpers/jwt.helper";

const adminLogin = async (_credentials: AdminLoginCredentials) => {
  const user = await getRepository(User)
    .createQueryBuilder("user")
    .select([
      "user.id",
      "user.firstname",
      "user.lastname",
      "user.password",
      "user.username",
      "user.role",
    ])
    .where("user.username = :userText", { userText: _credentials.username })
    .getOne();

  if (!user) return new HttpException("BAD_REQUEST", "Incorrect username");

  if (!(await validatePassword(_credentials.password, user.password))) {
    return new HttpException("BAD_REQUEST", "Incorrect password");
  }

  delete user.password;

  const { token, expiresIn } = signJwtAdminPayload(user);

  return {
    token,
    user,
    expiresIn,
  };
};

const authServices = {
  adminLogin,
};

export default authServices;
