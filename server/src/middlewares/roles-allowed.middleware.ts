import { NextFunction, Request, Response } from "express";
import { HttpException } from "../helpers/errors/http.exception";
import { UserRole } from "../modules/user/user.inteface";

type RolesString = keyof typeof UserRole;

const rolesAllowed = (roles: RolesString | RolesString[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("Roles Middleware");
    if (!roles || !roles.length)
      next(new HttpException("BAD_REQUEST", "Roles not provided"));

    if (!req.admin)
      next(new HttpException("NOT_FOUND", "User info is not provided"));

    const user = req.admin;

    const printOut = () => {
      return `AdminUser: ${user.username} - ${user.role} is allowed to used ${req.originalUrl}`;
    };

    if (Array.isArray(roles)) {
      if (
        roles.findIndex((item) => {
          return UserRole[item] === user.role;
        }) !== -1
      ) {
        console.log(printOut());
        next();
      } else {
        next(
          new HttpException(
            "UNAUTHORIZED",
            "You dont have any privileges to used this route"
          )
        );
      }
    }

    if (typeof roles === "string") {
      console.log("String test");
      if (UserRole[roles] === user.role) {
        console.log(printOut());
        next();
      } else {
        next(
          new HttpException(
            "UNAUTHORIZED",
            "You dont have any privileges to used this route"
          )
        );
      }
    }
  };
};

export default rolesAllowed;
