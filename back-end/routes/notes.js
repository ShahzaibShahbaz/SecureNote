const express = require("express");
const Note = require("../models/Note");
const auth = require("./auth");

const router = express.Router();

// Get all notes for the logged-in user
router.get("/", auth.authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error("Fetch notes error:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// Add a new note
router.post("/", auth.authenticateToken, async (req, res) => {
  try {
    const note = new Note({
      content: req.body.content,
      userId: req.user.id,
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error("Save note error:", error);
    res.status(500).json({ message: "Error saving note" });
  }
});

module.exports = router;
