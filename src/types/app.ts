import { NextFunction, Request, Response } from "express";

export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
