const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  task: [
    {
      type: String,
    }
  ]
});
const User = Mongoose.model("user", UserSchema)
module.exports = User;