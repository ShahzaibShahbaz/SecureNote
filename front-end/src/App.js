import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Notes from "./components/Notes";
import NoteEditor from "./components/NoteEditor";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/notes"
            element={
              <PrivateRoute>
                <Notes />
              </PrivateRoute>
            }
          />
          <Route
            path="/notes/edit/:noteId"
            element={
              <PrivateRoute>
                <NoteEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/notes/new"
            element={
              <PrivateRoute>
                <NoteEditor />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
