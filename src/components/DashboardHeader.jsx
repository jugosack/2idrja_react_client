import React from 'react';
import PropTypes from 'prop-types';

const DashboardHeader = ({
  user,
  activeSection,
  openAddModal,
  isLightTheme,
  setIsLightTheme,
}) => (
  <header className="cpbp-dashboard-header">
    <div className="cpbp-header-left">
      <span className="cpbp-header-title">Admin Dashboard</span>
      <button
        type="button"
        className="cpbp-add-button"
        onClick={openAddModal}
      >
        {(() => {
          if (activeSection === 'Instructors') return 'Add Instructor';
          if (activeSection === 'Users') return 'Add User';
          return 'Add Course';
        })()}
      </button>
      <button
        type="button"
        className="cpbp-theme-button"
        onClick={() => setIsLightTheme((t) => !t)}
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
);

DashboardHeader.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    avatar_url: PropTypes.string,
  }).isRequired,
  activeSection: PropTypes.string.isRequired,
  openAddModal: PropTypes.func.isRequired,
  isLightTheme: PropTypes.bool.isRequired,
  setIsLightTheme: PropTypes.func.isRequired,
};

export default DashboardHeader;
