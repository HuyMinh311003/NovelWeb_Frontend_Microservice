import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookOpen, FaUser, FaSignOutAlt, FaCaretDown } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";
import axios from "axios";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/Category/getall`);
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <FaBookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              NovelVerse
            </span>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/novels")}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              View Novels Now
            </button>

            {/* Dropdown for Categories */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              >
                View Categories Now
                <FaCaretDown className="ml-2" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-48 z-50">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div
                        key={category.categoryID}
                        onClick={() => {
                          navigate(`/categories/${category.categoryID}`);
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      >
                        {category.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No Categories</div>
                  )}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="icon-wrapper flex items-center gap-4">
                <div className="user-icon">
                  <Link to="/profile" className="hover:text-blue-600 transition-colors">
                    <FaUser className="h-6 w-6" title="User Profile" />
                  </Link>
                  <span>{user?.username || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-300/50"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
