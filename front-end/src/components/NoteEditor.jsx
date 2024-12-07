import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { encryptNoteContent, decryptNoteContent } from "../utils/cryptoUtils";
import Navbar from "./Navbar";

function NoteEditor() {
  const [note, setNote] = useState({ content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { noteId } = useParams();

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  const fetchNote = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !userEmail) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(
        `http://localhost:5000/notes/${noteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { encryptedContent, salt } = response.data;

      const userPassword = prompt("Enter your password to decrypt the note");

      if (!userPassword) {
        throw new Error("Password is required");
      }

      const decryptedContent = decryptNoteContent(
        encryptedContent,
        userPassword,
        userEmail // Use email as a unique identifier
      );

      setNote({
        content: decryptedContent || "",
      });
    } catch (error) {
      console.error("Error fetching note:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !userEmail) {
        throw new Error("Authentication required");
      }

      // Prompt for password (this is a simple implementation, consider a more secure method)
      const userPassword = prompt("Enter your password to encrypt the note");

      if (!userPassword) {
        throw new Error("Password is required");
      }

      const { iv, encryptedContent, salt } = encryptNoteContent(
        note.content,
        userPassword,
        userEmail // Use email as a unique identifier
      );

      const encryptedNote = {
        iv,
        encryptedContent,
        salt,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (noteId) {
        // Update note
        await axios.put(
          `http://localhost:5000/notes/${noteId}`,
          encryptedNote,
          { headers }
        );
      } else {
        // Create a new note
        const res = await axios.post(
          "http://localhost:5000/notes",
          encryptedNote,
          {
            headers,
          }
        );
      }
      navigate("/notes");
    } catch (error) {
      console.error("Error response:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
      setError(error.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {noteId ? "Edit Note" : "Create Note"}
        </h2>
        <Link to="/notes" className="text-blue-500 hover:text-blue-600">
          Back to Notes
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="content"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          placeholder="Write your note here..."
          className="w-full p-4 border rounded min-h-[200px]"
          required
        />
        <div className="flex justify-end space-x-4">
          <Link
            to="/notes"
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              loading ? "opacity-50" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Saving..." : noteId ? "Update Note" : "Create Note"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteEditor;
