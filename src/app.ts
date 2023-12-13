import "dotenv/config";
import dns from "node:dns";
import express from "express";
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

const { PORT = 3000, SET_DNS, DB_CONN } = process.env;

if (SET_DNS) dns.setServers(SET_DNS.split(","));

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.json());

app.get("/user/all", authRequest, getAll);

app.get("/user/:id", authRequest, getById);

app.post("/user", authRequest, createUser);

app.delete("/user/:id", authRequest, deleteUser);

app.post("/login", authRequest, loginUser);

app.use((_req, res) => {
  res.status(500).send();
});

if (DB_CONN)
  mongoose
    .connect(DB_CONN)
    .then(() => {
      console.log("Connected to DB");
      app.listen(PORT, () =>
        console.log(`Users servive is running at port ${PORT}`),
      );
    })
    .catch((err) => {
      console.log("Error during connecting to DB", err);
      process.exit(1);
    });
else console.log("No connection string specified");
