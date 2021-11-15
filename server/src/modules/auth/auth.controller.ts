import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { HttpException } from "../../helpers/errors/http.exception";

const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("admin", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(
        new HttpException("NOT_FOUND", "Invalid username or password")
      );
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        user: "User successfull logged in",
      });
    });
  })(req, res, next);
};

const adminLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.logout();
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
    const user = req.user;

    res.status(200).json({ message: `Welcome Admin, ${user.username}` });
  } catch (error) {
    next(error);
  }
};

const authController = { adminLogin, adminLogout, adminProtectedRoute };

export default authController;
