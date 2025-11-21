const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model("Note", noteSchema);
