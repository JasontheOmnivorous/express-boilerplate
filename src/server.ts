process.on("uncaughtException", (err: Error) => {
  console.log("Uncaught exception detected! Shutting down the application...");
  console.log(err.name, err.message);
  process.exit(1);
});

import mongoose from "mongoose";
import app from ".";

const DB = process.env.DB as string;
mongoose
  .connect(DB)
  .then(() => console.log("Database connected successfully!"));

const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log(`Server listening at port ${port}...`)
);

process.on("unhandledRejection", (err: Error) => {
  console.log("Unhandled rejection found! Shutting down the application...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
