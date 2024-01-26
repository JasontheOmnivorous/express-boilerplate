import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

const sendErrProd = (res: Response, err: AppError) => {
  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    message: err.message,
  });
};

const sendErrDev = (res: Response, err: AppError) => {
  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
};

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    sendErrProd(res, err);
  } else if (process.env.NODE_ENV === "development") {
    sendErrDev(res, err);
  }
};

export default globalErrorHandler;
