import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../middleware/catchAsync";
import { User } from "../model/userModel";
import AppError from "../utils/appError";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({ isActive: true });

    res.status(200).json({
      status: "success",
      totalUsers: users.length,
      data: users,
    });
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id, { isActive: true });

    if (!user) return next(new AppError("No user found with that id.", 400));

    res.status(200).json({
      status: "success",
      data: user,
    });
  }
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser)
      return next(
        new AppError("Something went wrong with updating user data.", 500)
      );

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
