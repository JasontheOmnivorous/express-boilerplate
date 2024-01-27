import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../middleware/catchAsync";
import { User } from "../model/userModel";
import { ExtendedRequest } from "../types/app";
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = filterBody(req.body, "email", "password");

    if (!email || !password)
      return next(new AppError("Email or Password is missing.", 400));

    const dbUser = await User.findOne({ email }).select("+password");

    if (!dbUser || !dbUser.comparePassword(password, dbUser.password))
      return next(
        new AppError(
          "No user found with that email or incorrect password.",
          400
        )
      );

    respondToken(res, 200, dbUser, next);
  }
);

export const authGuard = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    let token = "";

    if (
      req.headers.authorization ||
      req.headers.authorization?.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return next(
        new AppError(
          "You are not logged in. Please login to access the route.",
          401
        )
      );

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const dbUser = await User.findById(decodedToken.id, { isActive: true });

    if (!dbUser)
      return next(
        new AppError(
          "The user belonging to this token is no longer exists.",
          404
        )
      );

    if (dbUser.passwordChangedAfterLogin(decodedToken.iat as number))
      return next(
        new AppError(
          "User recently changed password. Please log in again.",
          401
        )
      );

    req.user = dbUser;
    next();
  }
);

export const restrictAccess = (...allowedRoles: string[]) => {
  return (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user?.role as string))
      return next(
        new AppError(
          "You do not have permission to perform this operation.",
          403
        )
      );

    next();
  };
};
