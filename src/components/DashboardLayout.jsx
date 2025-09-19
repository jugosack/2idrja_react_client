import React from 'react';
import PropTypes from 'prop-types';
import './DashboardLayout.css';

const DashboardLayout = ({
  user,
  activeSection,
  sections,
  onSectionChange,
  onAddClick,
  onThemeToggle,
  isLightTheme,
  onGoHome,
  onLogout,
  children,
}) => {
  const getAddButtonText = () => {
    if (activeSection === 'Instructors') return 'Add Instructor';
    if (activeSection === 'Users') return 'Add User';
    return 'Add Course';
  };

  return (
    <div className="cpbp-dashboard-container">
      <header className="cpbp-dashboard-header">
        <div className="cpbp-header-left">
          <span className="cpbp-header-title">Admin Dashboard</span>
          <button
            type="button"
            className="cpbp-add-button"
            onClick={onAddClick}
          >
            {getAddButtonText()}
          </button>
          <button
            type="button"
            className="cpbp-theme-button"
            onClick={onThemeToggle}
          >
            {isLightTheme ? 'Dark Theme' : 'Light Theme'}
          </button>
        </div>

        <div className="cpbp-header-right">
          <span className="cpbp-user-name">
            {user.first_name}
            {' '}
            {user.last_name}
          </span>
          <div className="cpbp-profile-pic-container">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                className="cpbp-profile-pic"
              />
            ) : (
              <span className="cpbp-user-icon">👤</span>
            )}
          </div>
        </div>
      </header>

      <div className="cpbp-dashboard-body">
        <div className="cpbp-panel nav-panel">
          <nav className="cpbp-dashboard-nav">
            <div className="cpbp-nav-top">
              {sections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  className={`cpbp-nav-button${
                    activeSection === sec ? ' active' : ''
                  }`}
                  onClick={() => onSectionChange(sec)}
                >
                  {sec}
                </button>
              ))}
            </div>
            <div className="cpbp-nav-bottom">
              <button
                type="button"
                className="cpbp-nav-button"
                onClick={onGoHome}
              >
                Home
              </button>
              <button
                type="button"
                className="cpbp-nav-button"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </nav>
        </div>

        <div className="cpbp-panel content-panel">
          <main className="cpbp-dashboard-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    avatar_url: PropTypes.string,
  }).isRequired,
  activeSection: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSectionChange: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  isLightTheme: PropTypes.bool.isRequired,
  onGoHome: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
