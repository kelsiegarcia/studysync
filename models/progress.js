const mongoose = require("mongoose");
const progressSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("Progress", progressSchema);
