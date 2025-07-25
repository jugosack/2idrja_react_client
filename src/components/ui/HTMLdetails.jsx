import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Details.css';

function Details({ course, onClose }) {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isBenefitsOpen, setBenefitsOpen] = useState(false);
  const [isTargetAudienceOpen, setTargetAudienceOpen] = useState(false);
  const [isMoreInfoOpen, setMoreInfoOpen] = useState(false);

  if (!course) return null;

  const {
    course_name: courseName,
    image_url: imageUrl,
    general_description: generalDescription, // <-- тука го менуваме
    benefits,
    target_audience: targetAudience,
    additional_info: additionalInfo,
  } = course;

  return (
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
          <button
            type="button"
            className="enroll-btn"
            onClick={() => alert(`You have enrolled in ${courseName}!`)}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}

Details.propTypes = {
  course: PropTypes.shape({
    course_name: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    general_description: PropTypes.string.isRequired, // <-- тука треба да додадеш
    benefits: PropTypes.string,
    target_audience: PropTypes.string,
    additional_info: PropTypes.string,
    fee: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    enrolled_students: PropTypes.number,
    max_students: PropTypes.number,
    places_left: PropTypes.number,
    course_status: PropTypes.string,
    rating: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Details;
