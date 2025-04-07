const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, }, 
  programme: { 
    type: String,
    validate: {
      validator: async (value) => {
        const programme = mongoose.model("Programme");
        const programmeExists = await programme.findOne({ name: value });
        return !!programmeExists;
      },
      message: props => `${props.value} is not a valid programme.`
    }
  }, 
  role: { type: String, enum: ["admin", "user"] },
  createdAt: { type: Date, default: Date.now }
});
     
module.exports = mongoose.model("User", UserSchema);