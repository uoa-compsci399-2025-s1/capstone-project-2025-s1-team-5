const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, }, 
  programme: { type: String}, 
  role: { type: String, enum: ["admin", "user"]},
  createdAt: { type: Date, default: Date.now }
});
     
module.exports = mongoose.model("User", UserSchema);