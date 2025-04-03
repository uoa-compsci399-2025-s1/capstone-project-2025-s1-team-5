const mongoose = require("mongoose");

const SubsectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {type: String, required: true}
  subsection: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subsection" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Subsection", SubsectionSchema);