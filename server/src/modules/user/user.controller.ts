import { NextFunction, Request, Response } from "express";
import { CreateUser, GetUserQuery, UpdateUser } from "./user.inteface";
import userServices from "./user.service";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, take, order, search } = req.query as any;

    res.status(200).json(
      await userServices.getAll({
        page,
        take,
        order,
        search,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    res.status(200).json(await userServices.getById(id));
  } catch (error) {
    next(error);
  }
};

const create = async (
  req: Request<{}, { user: CreateUser }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body.user;
    res.status(200).json(await userServices.create(user));
  } catch (error) {
    next(error);
  }
};

const update = async (
  req: Request<{}, { user: UpdateUser }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body.user;
    res.status(200).json(await userServices.create(user));
  } catch (error) {
    next(error);
  }
};

const remove = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    res.status(200).json(await userServices.remove(id));
  } catch (error) {
    next(error);
  }
};

const userController = {
  getUsers,
  getUserById,
  create,
  update,
  remove,
};

export default userController;
