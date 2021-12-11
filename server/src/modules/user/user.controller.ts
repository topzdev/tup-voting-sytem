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

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as any;

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
    const user = req.body;
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
    const user = req.body;
    res.status(200).json(await userServices.update(user));
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

const restore = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    res.status(200).json(await userServices.restore(id));
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
  restore,
};

export default userController;
