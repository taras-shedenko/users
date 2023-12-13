import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "./User";

export const authRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.headers.authorization !== process.env.BEARER_TOKEN)
    res.sendStatus(401);
  else next();
};

export const getAll = async (_req: Request, res: Response) => {
  const users = await User.find();

  res.json(
    users.map((user) => ({ id: user._id.toString(), login: user.login })),
  );
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();

    if (user) res.json({ id: user._id.toString(), login: user.login });
    else res.sendStatus(404);
  } catch (e) {
    next(e);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { login, password } = req.body;

  if (login && password) {
    try {
      const user = await User.create({ login, password });

      res.json({ id: user._id.toString(), login: user.login });
    } catch (e) {
      next(e);
    }
  } else res.sendStatus(400);
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (id) {
    try {
      const user = await User.findByIdAndDelete(id).exec();

      res.json({ success: user !== null });
    } catch (e) {
      next(e);
    }
  } else res.sendStatus(400);
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { login, password } = req.body;

  if (login && password) {
    try {
      const user = await User.findOne({ login }).exec();

      const success = user
        ? await bcrypt.compare(password, user.password)
        : false;

      const result = {
        success,
        ...(success && user && { id: user._id, login: user.login }),
      };

      res.json(result);
    } catch (e) {
      next(e);
    }
  } else res.sendStatus(400);
};
