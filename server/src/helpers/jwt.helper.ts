import jwt, { JwtPayload } from "jsonwebtoken";
import configs from "../configs";
import { PickedUser } from "../type/express-serve-static-core";

export const signJwtAdminPayload = (_user: PickedUser) => {
  const expiresIn = configs.jwt.admin.expiresIn;

  console.log("Payload user: ", _user);

  const payload: JwtPayload = {
    admin: _user,
    iat: Date.now(),
  };

  console.log(configs.jwt.admin);

  const signedToken = jwt.sign(payload, configs.jwt.admin.secret, {
    expiresIn,
    // algorithm: configs.jwt.admin.algo as any,
  });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn,
  };
};
