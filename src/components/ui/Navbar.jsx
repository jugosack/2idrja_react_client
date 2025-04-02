/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../icons/2drijaLogo.png';
import userLogo from '../icons/userLogo.svg';

const Navbar = ({ className = '' }) => { // Default empty string for className
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token); // Convert token existence to boolean
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/logout', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Optionally show error to user
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg${className ? ` ${className}` : ''}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img className="logo" src={logo} alt="logo of 2DRIJA" style={{ width: '80px' }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          data-bs-theme="dark"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="absoluteBox">
          <div
            className="collapse navbar-collapse justify-content-end align-items-center"
            id="navbarSupportedContent"
          >
            <div className="ms-auto">
              <ul className="navbar-nav me-auto mb-lg-0 text-center">
                <li className="nav-item">
                  <Link className="nav-link text-white" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="dropdownAlignmentFixing nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle text-white btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Projects
                  </button>
                  <ul className="dropdown-menu">
                    <li className="listDropdown">
                      <Link className="dropdown-item" to="/projectscoding">
                        Coding projects
                      </Link>
                    </li>
                    <li className="listDropdown">
                      <Link className="dropdown-item" to="/projectsresearch">
                        Research projects
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="listDropdown nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle text-white btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Courses
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/coursesfrontend">
                        Front-end
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/coursesreact">
                        React
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/coursesuiux">
                        UI/UX
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/about">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="ms-auto">
              <ul className="navbar-nav mb-lg-0 user-icon text-end">
                <li id="login-icon" className="listDropdown nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle text-white btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img src={userLogo} alt="User Icon" />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {isAuthenticated ? (
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          type="button"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    ) : (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/register">
                            Register
                          </Link>
                        </li>
                        <li>
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
      </div>
    </nav>
  );
};

export default Navbar;
