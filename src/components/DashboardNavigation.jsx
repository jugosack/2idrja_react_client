import React from 'react';
import PropTypes from 'prop-types';

const DashboardNavigation = ({
  sections,
  activeSection,
  setActiveSection,
  goHome,
  handleLogout,
}) => (
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
            onClick={() => setActiveSection(sec)}
          >
            {sec}
          </button>
        ))}
      </div>
      <div className="cpbp-nav-bottom">
        <button
          type="button"
          className="cpbp-nav-button"
          onClick={goHome}
        >
          Home
        </button>
        <button
          type="button"
          className="cpbp-nav-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  </div>
);

DashboardNavigation.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default DashboardNavigation;
