import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { catchAsync } from "../middleware/catchAsync";
import { UserType } from "../types/user";
import { filterBody } from "../utils/helpers";

// type of Model may differ from what model we're using
export const crateOne = (Model: Model<UserType>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validBody = filterBody(
      req.body,
      "name",
      "email",
      "password",
      "confirmPassword",
      "role"
    );

    const newDocument = await Model.create(validBody);

    res.status(201).json({
      status: "success",
      data: {
        data: newDocument,
      },
    });
  });
};
