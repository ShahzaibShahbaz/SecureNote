import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex justify-between items-center py-4">
        <div className="text-xl font-bold text-gray-800">SecureNote.</div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-colors duration-300 "
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
