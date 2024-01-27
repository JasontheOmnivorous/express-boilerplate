import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../types/user";
import AppError from "./appError";

export const filterBody = (body: any, ...allowedFields: string[]) => {
  const finalObj: any = {};

  Object.keys(body).forEach((key) => {
    finalObj[key] = body[key];
  });

  return finalObj;
};

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const respondToken = (
  res: Response,
  statusCode: number,
  user: UserType,
  next: NextFunction
) => {
  const token = generateToken(user.id);

  if (!token)
    return next(
      new AppError("There was an error generating the Json Web Token.", 500)
    );

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: "success",
    token,
  });
};
