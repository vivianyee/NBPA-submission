import { createRequire } from "module"

const require = createRequire(import.meta.url);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  "Date": String,
  "Client": String,
  "Project": String,
  "Project Code": String,
  "Hours": Number,
  "Billable?": String,
  "First Name": String,
  "Last Name": String,
  "Billable Rate": Number,
}, { collection: 'Timesheets'});

const Timesheets = mongoose.model("Timesheets", UserSchema);

export default Timesheets;