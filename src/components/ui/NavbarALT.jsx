/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavbarALT.css';
import userLogo from '../icons/userLogo.svg';
// import profilePictureTemp from '../images/Profile_img_2.png';
import { ReactComponent as HomeIcon } from '../icons/home-svgrepo-com.svg';

const NavbarALT = ({ className = '' }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');

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
    <nav className={`navbar pt-3 navbar-expand-lg${className ? ` ${className}` : ''}`}>
      <div className="container-fluid d-flex justify-content-center" id="hamburger-icon">
        <button
          className="navbar-toggler main-hamburger-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="absoluteBoxALT">
          <div
            className="collapse navbar-collapse justify-content-end align-items-center"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-lg-0 text-center make-this-menu-gap">
              <li className="nav-item pillshape-bg">
                <Link className="nav-link text-white" aria-current="page" to="/">
                  Home
                  <HomeIcon className="home-icon" />
                </Link>
              </li>
              <li className="nav-item pillshape-bg">
                <Link className="nav-link text-white" to="/courses-panel">
                  Courses
                </Link>
              </li>
              <li className="nav-item pillshape-bg">
                <Link className="nav-link text-white" to="/account-settings">
                  Settings
                </Link>
              </li>
              <li className="nav-item pillshape-bg">
                <Link className="nav-link text-white" to="/dashboard">
                  Dasboard
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav mb-lg-0 user-icon text-end">
              <li id="login-icon" className="listDropdown nav-item dropdown navbar-user-btn-positioning">
                <button
                  type="button"
                  className="nav-link dropdown-toggle text-white btn"
                  id="login-icon-btn"
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
                            <li
                              className="dropdown-item pillshape-bg-ForNameBGOnMobileScreens
                              d-flex align-items-center gap-2"

                            >
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
                                  {user.first_name}
                                  {' '}
                                  {user.last_name}
                                </span>
                                <span>{user.email}</span>
                              </div>
                            </li>
                            <hr className="dropdown-separator" />
                          </>
                        )}
                      </li>

                      <li className="">
                        <div className="button-for-logging-out-drop-downALT">
                          <button
                            type="button"
                            className="dropdown-item logging-out-button"
                            id="logging-out-button-id"
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

export default NavbarALT;
