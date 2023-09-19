import { createRequire } from "module"
import Timesheets from "./model/model.js"

const require = createRequire(import.meta.url);
var bodyParser = require('body-parser')
const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  
  const users = await Timesheets.find({});

  try {
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/:client", async (req, res) => {
  const user = await Timesheets.find({ Client: req.params.client});

  try {
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/add", async (req, res, next) => {
  var post = new Timesheets({
    Date: req.body.Date,
    Client: req.body.Client,
    Project: req.body.Project,
    "Project Code": req.body["Project Code"],
    Hours: req.body.Hours,
    "Billable?": req.body["Billable?"],
    "First Name": req.body["First Name"],
    "Last Name": req.body["Last Name"],
    "Billable Rate": req.body["Billable Rate"]
  })
  
	await post.save()
	res.send(post)
});

export default app
