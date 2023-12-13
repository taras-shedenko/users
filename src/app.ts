import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import {
  authRequest,
  getAll,
  getById,
  createUser,
  deleteUser,
  loginUser,
} from "./controllers";

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.json());

app.get("/user/all", authRequest, getAll);

app.get("/user/:id", authRequest, getById);

app.post("/user", authRequest, createUser);

app.delete("/user/:id", authRequest, deleteUser);

app.post("/login", authRequest, loginUser);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) =>
  res.status(500).send(String(err))
);

const port = process.env.PORT || "3000";

if (process.env.DB_CONN)
  mongoose
    .connect(process.env.DB_CONN!)
    .then(() => {
      console.log("Connected to DB");
      app.listen(port, () =>
        console.log(`Users servive is running at port ${port}`)
      );
    })
    .catch((err) => {
      console.log("Error during connecting to DB", err);
      process.exit(1);
    });
else console.log("No connection string specified");
