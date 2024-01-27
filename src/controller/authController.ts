import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../middleware/catchAsync";
import { User } from "../model/userModel";
import AppError from "../utils/appError";
import { filterBody, respondToken } from "../utils/helpers";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { name, email, password, confirmPassword, role } = filterBody(
      req.body,
      "name",
      "email",
      "password",
      "confirmPassword",
      "role"
    );

    if (!name || !email || !password || !confirmPassword)
      return next(new AppError("Required fields are missing", 400));

    if (role === process.env.ADMIN_EMAIL) role = "admin";

    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    if (!user)
      return next(
        new AppError("Something went wrong with creating this user.", 500)
      );

    respondToken(res, 201, user, next);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
