const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Avoid re-compiling the model if it already exists
module.exports = mongoose.models.Note || mongoose.model("Note", noteSchema);
