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
// edit an existing note
router.get("/:id", auth.authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error fetching note", error });
  }
});
// Update an existing note
router.put("/:id", auth.authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Note ID from URL
    const { content } = req.body;

    // Validate content
    if (!content) {
      return res.status(400).json({ message: "Note content is required" });
    }

    // Find the note by ID and ensure it belongs to the authenticated user
    const note = await Note.findById(id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found or access denied" });
    }

    // Update the note content
    note.content = content;
    await note.save();
    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note", error });
  }
});


module.exports = router;
