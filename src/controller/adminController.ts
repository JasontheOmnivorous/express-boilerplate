import { User } from "../model/userModel";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./factoryController";

export const getAllUsers = getAll(User);

export const getUser = getOne(User);

export const createUser = createOne(User);

export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);
