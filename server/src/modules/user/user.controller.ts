import { Request, Response } from "express";

const getUsers = async (req: Request, res: Response) => {
  try {
    res.send("get all users");
  } catch (error) {
    throw error;
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    res.send(`get user ID #${id}`);
  } catch (error) {
    throw error;
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    console.log(user);
    res.send(`create user ${user.first_name} ${user.last_name}`);
  } catch (error) {
    throw error;
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    res.send(`updated user ${user.id}`);
  } catch (error) {
    throw error;
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    res.send(`remove user ${id}`);
  } catch (error) {
    throw error;
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
