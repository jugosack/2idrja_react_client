/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../icons/2drijaLogo.png';
import userLogo from '../icons/userLogo.svg';
// COMMENT

import profilePictureTemp from '../images/Profile_img_2.png';

const Navbar = ({ className = '' }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    // eslint-disable-next-line
    console.log('Token:', token);
    setIsAuthenticated(!!token);
    if (token) {
      fetch('http://localhost:3000/current_user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.error('Failed to fetch user:', err);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        // eslint-disable-next-line
        console.log('No token found, redirecting to login');
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
        const errorText = await response.text();
        // eslint-disable-next-line
        console.error('Logout failed:', errorText);
        throw new Error('Logout failed');
      }

      sessionStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg${className ? ` ${className}` : ''}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img className="logo" src={logo} alt="2DRIJA Logo" style={{ width: '80px' }} />
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
          <div className="collapse navbar-collapse justify-content-end align-items-center" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-lg-0 text-center">
              <li className="nav-item">
                <Link className="nav-link text-white" aria-current="page" to="/">
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
                <ul className="dropdown-menu colorisation">
                  <li className="listDropdown text-center">
                    <Link className="dropdown-item" to="/coursesfrontend">
                      Front-end
                    </Link>
                  </li>
                  <li className="listDropdown text-center">
                    <Link className="dropdown-item" to="/coursesreact">
                      React
                    </Link>
                  </li>
                  <li className="listDropdown text-center">
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
                      <li className="">
                        {user && (
                          <>
                            <li className="dropdown-item d-flex align-items-center gap-2">
                              <img
                                src={profilePictureTemp}
                                alt="User"
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                }}
                              />
                              <div className="d-flex flex-column">
                                <span>
                                  {user.first_name}
                                  {' '}
                                  {user.last_name}
                                </span>
                                <span>
                                  {user.email}
                                </span>
                              </div>
                            </li>
                            <hr className="dropdown-separator" />
                          </>
                        )}
                      </li>
                      <li className="">
                        <Link className="dropdown-item" to="/dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li className="">
                        <Link className="dropdown-item" to="/">
                          Courses
                        </Link>
                      </li>
                      <li className="">
                        <Link className="dropdown-item" to="/">
                          Settings
                        </Link>
                      </li>
                      <li className="">
                        <hr className="dropdown-separator" />
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Log out
                        </button>
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
