import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import {
  deriveKeyFromPassword,
  encryptNoteContent,
  decryptNoteContent,
} from "../utils/cryptoUtils";
import Navbar from "./Navbar";
function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  // Notes.jsx
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !userEmail) {
        navigate("/");
        return;
      }

      // Prompt for password (this is a simple implementation, consider a more secure method)
      const userPassword = prompt("Enter your password to decrypt notes");

      if (!userPassword) {
        throw new Error("Password is required");
      }

      const response = await axios.get("http://localhost:5000/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const decryptedNotes = response.data.map((note) => {
        try {
          const decryptedContent = decryptNoteContent(
            note.encryptedContent,
            userPassword,
            userEmail,
            note.salt
          );

          return {
            ...note,
            content: decryptedContent,
          };
        } catch (error) {
          console.error("Decryption failed for a note:", error);
          return {
            ...note,
            content: "Decryption failed",
          };
        }
      });

      setNotes(decryptedNotes);
    } catch (error) {
      setError("Failed to fetch notes");
      if (error.response?.status === 401) {
        navigate("/"); // Redirect to the login page or root route
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <Navbar />
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-2xl font-bold">Your Notes</h1>
        <div className="space-x-4">
          <Link
            to="/notes/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 no-underline"
          >
            Create New Note
          </Link>
        </div>
      </div>
      {notes.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No notes yet. Create your first note!
        </p>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note._id} className="border p-4 rounded">
              <p className="mb-4">{note.content}</p>
              <Link
                to={`/notes/edit/${note._id}`}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
