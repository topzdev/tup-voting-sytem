import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { HttpException } from "../../helpers/errors/http.exception";
import authServices from "./auth.service";

const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = req.body;
    res.status(200).json(await authServices.adminLogin(credentials));
  } catch (error) {
    next(error);
  }
};

const adminLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    next(error);
  }
};

const adminProtectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admin = req.admin;

    res.status(200).json({ message: `Welcome Admin, ${admin.username}` });
  } catch (error) {
    next(error);
  }
};

const adminSessignLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("admin", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(
        new HttpException("NOT_FOUND", "Invalid username or password")
      );
    }
    console.log("test", info, req);

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        user,
      });
    });
  })(req, res, next);
};

const adminSessionLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.logout();
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    next(error);
  }
};

const authController = { adminLogin, adminLogout, adminProtectedRoute };

export default authController;
