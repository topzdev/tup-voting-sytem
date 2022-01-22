import jwt, { JwtPayload } from "jsonwebtoken";
import configs from "../configs";
import { PickedUser, PickedVoter } from "../type/express-serve-static-core";

export const signJwtAdminPayload = (_user: PickedUser) => {
  const expiresIn = configs.jwt.admin.expiresIn;
  const secret = configs.jwt.admin.secret;

  console.log("Payload user: ", _user);

  const payload: JwtPayload = {
    admin: _user,
    iat: Date.now(),
  };

  console.log(configs.jwt.admin);

  const signedToken = jwt.sign(payload, secret, {
    expiresIn,
    // algorithm: configs.jwt.admin.algo as any,
  });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn,
  };
};

export const signJwtVoterPayload = (_voter: PickedVoter) => {
  const expiresIn = configs.jwt.voter.expiresIn;
  const secret = configs.jwt.voter.secret;

  console.log("Payload voter: ", _voter);

  const payload: JwtPayload = {
    voter: _voter,
    iat: Date.now(),
  };

  console.log(configs.jwt.voter);

  const signedToken = jwt.sign(payload, secret, {
    expiresIn,
    // algorithm: configs.jwt.admin.algo as any,
  });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn,
  };
};
