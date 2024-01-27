import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import globalErrorHandler from "./middleware/globalErrorHandler";
import AppError from "./utils/appError";
const app = express();
dotenv.config({ path: ".env" });

app.use(helmet());

app.use("*", cors({ origin: "*" })); // config to your path origin

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// config rate limit according to your app type
const limiter = rateLimit({
  windowMs: Date.now() * 60 * 60 * 1000,
  limit: 100,
  message: "Too much requests from you. Try again in an hour.",
});
app.use("/api", limiter);

// limit data transfer rate according to your app
app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

// app.use("/api/v1/user");
// app.use("/api/v1/todo");

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("This route is not defined on this server.", 404));
});

app.use(globalErrorHandler);

export default app;
