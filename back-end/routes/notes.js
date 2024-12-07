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
router.post("/", auth.authenticateToken, async (req, res) => {
  try {
    const { iv, encryptedContent, salt } = req.body;

    if (!iv || !encryptedContent || !salt) {
      return res
        .status(400)
        .json({ message: "Note content and salt are required" });
    }
    console.log("Encrypted Content Received:", req.body.encryptedContent);
    console.log("Salt Received:", req.body.salt);

    // Return the encrypted content and salt as Base64 strings
    const note = new Note({
      iv: iv.words,
      encryptedContent, // Base64 string
      salt, // Base64 string
      userId: req.user.id,
    });

    await note.save();
    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note", error });
  }
});
// fetch a note for editing
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
//update an edited note
router.put("/:id", auth.authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { encryptedContent, salt } = req.body;

    // Validate encrypted content and salt
    if (!encryptedContent || !salt) {
      return res
        .status(400)
        .json({ message: "Encrypted content and salt are required" });
    }

    // Find the note by ID and ensure it belongs to the authenticated user
    const note = await Note.findById(id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Note not found or access denied" });
    }

    // Update the note's encrypted content and salt
    note.encryptedContent = encryptedContent;
    note.salt = salt;
    await note.save();

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note", error });
  }
});

module.exports = router;
