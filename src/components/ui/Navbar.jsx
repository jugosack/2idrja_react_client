/* eslint-disable react/prop-types */
/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../icons/2drijaLogo.png";
import userLogo from "../icons/userLogo.svg";
import { getCourses } from "../../services/CourseService";

const Navbar = ({ className = "" }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    setIsAuthenticated(!!token);

    if (token) {
      fetch("http://localhost:3000/current_user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setIsAdmin(data.role === "admin");
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
        });
    }
    // fetch courses for dropdown
    getCourses()
      .then((list) => setCourses(Array.isArray(list) ? list : []))
      .catch(() => setCourses([]));
  }, []);

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/logout", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Logout failed:", errorText);
        throw new Error("Logout failed");
      }

      sessionStorage.removeItem("auth_token");
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-lg${className ? ` ${className}` : ""}`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            className="logo"
            src={logo}
            alt="2DRIJA Logo"
            style={{ width: "80px" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="absoluteBox">
          <div
            className="collapse navbar-collapse justify-content-end align-items-center"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-lg-0 text-center">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  Home
                </Link>
              </li>
              <li className="dropdownAlignmentFixing nav-item dropdown">
                <button
                  type="button"
                  className="nav-link dropdown-toggle text-white btn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Projects
                </button>
                <ul className="dropdown-menu colorisation">
                  <li className="listDropdown text-center">
                    <Link className="dropdown-item" to="/projectscoding">
                      Coding projects
                    </Link>
                  </li>
                  <li className="listDropdown text-center">
                    <Link className="dropdown-item" to="/projectsresearch">
                      Research projects
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown dropdownAlignmentFixing">
                <button
                  type="button"
                  className="nav-link dropdown-toggle text-white btn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Courses
                </button>
                <ul className="dropdown-menu colorisation mega-dropdown-list">
                  {courses.length === 0 && (
                    <li className="listDropdown text-center">
                      <span className="dropdown-item">No courses</span>
                    </li>
                  )}
                  {courses.map((course) => (
                    <li key={course.id} className="listDropdown text-center">
                      <Link
                        className="dropdown-item"
                        to={`/courses/${course.id}`}
                      >
                        {course.course_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/about">
                  About
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav mb-lg-0 user-icon text-end">
              <li id="login-icon" className="listDropdown nav-item dropdown">
                <button
                  type="button"
                  className="nav-link dropdown-toggle text-white btn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img src={userLogo} alt="User Icon" />
                </button>
                <ul className="dropdown-menu colorisation dropdown-menu-end">
                  {isAuthenticated ? (
                    <>
                      {user && (
                        <>
                          <li className="dropdown-item d-flex align-items-center gap-2">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt="User"
                                className="navbar-user-avatar"
                              />
                            ) : (
                              <div className="navbar-user-initials">
                                {user.first_name?.[0]}
                                {user.last_name?.[0]}
                              </div>
                            )}
                            <div className="d-flex flex-column">
                              <span>
                                {user.first_name} {user.last_name}
                              </span>
                              <span>{user.email}</span>
                            </div>
                          </li>
                          <hr className="dropdown-separator" />
                        </>
                      )}
                      <li>
                        <Link className="dropdown-item" to="/dashboard">
                          Dashboard
                        </Link>
                      </li>
                      {isAdmin && (
                        <li>
                          <Link className="dropdown-item" to="/courses-panel">
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link className="dropdown-item" to="/account-settings">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-separator" />
                        <div className="button-for-logging-out-drop-down">
                          <button
                            type="button"
                            className="dropdown-item logging-out-button"
                            onClick={handleLogout}
                          >
                            Log out
                          </button>
                        </div>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="listDropdown">
                        <Link className="dropdown-item" to="/register">
                          Register
                        </Link>
                      </li>
                      <li className="listDropdown">
                        <Link className="dropdown-item" to="/login">
                          Login
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
