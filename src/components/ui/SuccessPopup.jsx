import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './SuccessPopup.css';

export default function SuccessPopup({ onClose, course }) {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleGoToDashboard();
    }
  };

  return (
    <div
      className="success-overlay"
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      aria-label="Close success popup"
    >
      <div
        className="success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
      >
        <div className="success-icon">✅</div>

        <h2 id="success-title" className="success-title">
          Payment Successful!
        </h2>

        <div className="success-box">
          <p className="success-message">
            Your payment has been processed successfully. 🎉 The course has been
            added to your
            {' '}
            <strong>dashboard</strong>
            .
          </p>
        </div>

        {course && (
          <div className="enrolled-course-card">
            <div className="course-card-header">
              <h3 className="course-card-title">{course.courseName || course.course_name || 'Course'}</h3>
              <span className="enrolled-badge">Enrolled</span>
            </div>
          </div>
        )}

        <button
          type="button"
          className="success-btn"
          onClick={handleGoToDashboard}
          aria-label="Go to Dashboard"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

SuccessPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  course: PropTypes.shape({
    courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    courseName: PropTypes.string,
    course_name: PropTypes.string,
  }),
};

SuccessPopup.defaultProps = {
  course: null,
};
