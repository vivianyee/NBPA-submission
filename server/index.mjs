import Router from "./routes.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const username = "vivianyee888";
const password = "dFnsEr9JAp1tFls5";
const cluster = "Timesheets";
const dbname = "NBPATimesheets";

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.garujyt.mongodb.net/${dbname}?retryWrites=true&w=majority`
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
app.use(Router);
app.listen(5050, () => {
  console.log("Server is running at port 5050");
});
