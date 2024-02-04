import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { catchAsync } from "../middleware/catchAsync";
import { UserType } from "../types/user";
import ApiFeatures from "../utils/apiFeatures";
import AppError from "../utils/appError";
import { filterBody } from "../utils/helpers";

export const getAll = (Model: Model<UserType>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();

    const documents = await features.query;

    res.status(200).json({
      status: "success",
      data: {
        data: documents,
      },
    });
  });
};

export const getOne = (Model: Model<UserType>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findById(req.params.id);

    if (!document)
      return next(new AppError(`No ${Model} found with that id.`, 400));

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });
};

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

export const updateOne = (Model: Model<UserType>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!document)
      return next(new AppError(`No ${Model} found with that id.`, 400));

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });
};

export const deleteOne = (Model: Model<UserType>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document)
      return next(new AppError(`No ${Model} found with that id.`, 400));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};
