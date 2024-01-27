import { NextFunction, Request, Response } from "express";
import { UserType } from "./user";

export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface ExtendedRequest extends Request {
  user?: UserType;
}
