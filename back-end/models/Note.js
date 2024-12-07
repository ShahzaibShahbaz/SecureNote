const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  iv: {
    type: [Number], // Array of numbers (32-bit integers, i.e., words)
    required: true,
  },
  encryptedContent: {
    type: String, // Encrypted note content
    required: true,
  },
  salt: {
    type: String, // Salt used for key derivation (PBKDF2)
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
