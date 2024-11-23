const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Avoid re-compiling the model if it already exists
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
