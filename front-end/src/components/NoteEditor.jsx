import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

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
      const response = await axios.get(
        `http://localhost:5000/notes/${noteId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNote(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
      setError("Failed to fetch note");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      if (noteId) {
        await axios.put(`http://localhost:5000/notes/${noteId}`, note, {
          headers,
        });
      } else {
        await axios.post("http://localhost:5000/notes", note, { headers });
      }
      navigate("/notes");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
      setError("Failed to save note");
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
