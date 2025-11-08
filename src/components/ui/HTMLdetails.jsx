import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EnrollNow from './EnrollNow';
import './Details.css';

function Details({ course, onClose, isEnrolled = false }) {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isBenefitsOpen, setBenefitsOpen] = useState(false);
  const [isTargetAudienceOpen, setTargetAudienceOpen] = useState(false);
  const [isMoreInfoOpen, setMoreInfoOpen] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  if (!course) return null;

  const {
    id,
    course_name: courseName,
    image_url: imageUrl,
    general_description: generalDescription,
    benefits,
    target_audience: targetAudience,
    additional_info: additionalInfo,
    start_date: startDate,
    end_date: endDate,
    fee,
    places_left: placesLeft,
  } = course;

  // Create course data object for EnrollNow modal
  const courseDataForEnroll = {
    id,
    course_name: courseName,
    start_date: startDate,
    end_date: endDate,
    fee,
    places_left: placesLeft,
  };

  // Check if course is past (end_date has passed)
  const isPastCourse = () => {
    if (!endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const courseEndDate = new Date(endDate);
    courseEndDate.setHours(0, 0, 0, 0);
    return today > courseEndDate;
  };

  const handleEnrollClick = () => {
    // Don't allow enrollment if course is past
    if (isPastCourse()) {
      return;
    }

    const token = sessionStorage.getItem('auth_token');

    if (!token) {
      alert('Please login first to enroll in a course');
      window.location.href = '/login';
    } else {
      setShowEnrollModal(true);
    }
  };

  const handleCloseEnrollModal = () => {
    setShowEnrollModal(false);
  };

  // Render enrollment button or message based on course status
  const renderEnrollmentSection = () => {
    // If enrolled and course is past, don't show anything (Review button is on card)
    if (isEnrolled && isPastCourse()) {
      return null;
    }
    // If enrolled but not past, show enrolled message
    if (isEnrolled) {
      return (
        <div className="enrolled-message">
          <p>You are enrolled in this course.</p>
        </div>
      );
    }
    // If not enrolled but course is past
    if (isPastCourse()) {
      return (
        <div className="course-ended-message">
          <p>This course has ended. Enrollment is no longer available.</p>
        </div>
      );
    }
    // If not enrolled and course is available
    return (
      <button
        type="button"
        className="enroll-btn"
        onClick={handleEnrollClick}
      >
        Enroll Now
      </button>
    );
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content scrollable-popup">
          <button
            type="button"
            className="close-btnn"
            onClick={onClose}
            aria-label="Close details popup"
          >
            ×
          </button>

          <img src={imageUrl} alt={courseName} className="details-image" />
          <h2>{courseName}</h2>

          {/* Description со Show more / less */}
          <div className="description-section">
            <p>
              {generalDescription}
              {isDescriptionExpanded && (
                <>
                  {' '}
                  This course will provide you with valuable knowledge and practical skills.
                </>
              )}
            </p>
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? 'Show less' : 'Show more...'}
            </button>
          </div>

          {/* Benefits Accordion */}
          <div className="accordion-section">
            <button
              className="accordion-toggle"
              type="button"
              onClick={() => setBenefitsOpen(!isBenefitsOpen)}
            >
              Benefits
              {' '}
              {isBenefitsOpen ? '▲' : '▼'}
            </button>
            {isBenefitsOpen && (
              <ul className="accordion-content">
                <li>{benefits}</li>
              </ul>
            )}
          </div>

          {/* Target Audience Accordion */}
          <div className="accordion-section">
            <button
              className="accordion-toggle"
              type="button"
              onClick={() => setTargetAudienceOpen(!isTargetAudienceOpen)}
            >
              Target Audience
              {' '}
              {isTargetAudienceOpen ? '▲' : '▼'}
            </button>
            {isTargetAudienceOpen && (
              <ul className="accordion-content">
                <li>{targetAudience}</li>
              </ul>
            )}
          </div>

          {/* Additional Info Accordion */}
          <div className="accordion-section">
            <button
              className="accordion-toggle"
              type="button"
              onClick={() => setMoreInfoOpen(!isMoreInfoOpen)}
            >
              Additional Info
              {' '}
              {isMoreInfoOpen ? '▲' : '▼'}
            </button>
            {isMoreInfoOpen && (
              <ul className="accordion-content">
                {additionalInfo}
              </ul>
            )}
          </div>

          <div className="enroll-container">
            {renderEnrollmentSection()}
          </div>
        </div>
      </div>

      {/* Render EnrollNow modal when showEnrollModal is true */}
      {showEnrollModal && (
        <EnrollNow
          course={courseDataForEnroll}
          onClose={handleCloseEnrollModal}
        />
      )}
    </>
  );
}

Details.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course_name: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    general_description: PropTypes.string.isRequired,
    benefits: PropTypes.string,
    target_audience: PropTypes.string,
    additional_info: PropTypes.string,
    fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    enrolled_students: PropTypes.number,
    max_students: PropTypes.number,
    places_left: PropTypes.number,
    course_status: PropTypes.string,
    rating: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  isEnrolled: PropTypes.bool,
};

export default Details;
