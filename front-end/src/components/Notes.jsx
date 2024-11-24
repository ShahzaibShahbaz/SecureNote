import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/notes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
      setError("Failed to fetch notes");
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Notes</h1>
        <div className="space-x-4">
          <Link
            to="/notes/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Note
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
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
      <div>
      <h1>Your Notes</h1>
      <Link to="/notes/new">
        <button>Create New Note</button>
      </Link>
      {notes.map((note) => (
        <div key={note._id}>
          <p>{note.content}</p>
          <Link to={`/notes/edit/${note._id}`}>
            <button>Edit</button>
          </Link>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Notes;
