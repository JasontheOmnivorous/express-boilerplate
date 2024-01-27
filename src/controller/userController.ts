import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../middleware/catchAsync";
import { User } from "../model/userModel";
import { ExtendedRequest } from "../types/app";
import AppError from "../utils/appError";
import { filterBody } from "../utils/helpers";

export const updateMe = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.confirmPassword)
      return next(
        new AppError(
          "This route is not for password related operations. Please use /update-my-password endpoint.",
          400
        )
      );

    const validBody = filterBody(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(req.user?.id, validBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
