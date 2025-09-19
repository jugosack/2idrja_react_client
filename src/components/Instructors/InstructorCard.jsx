import React from 'react';
import PropTypes from 'prop-types';
import './InstructorCard.css';

const InstructorCard = ({ instructor, onEdit, onDelete }) => (
  <div className="cpbp-card instructor-card">
    <div className="cpbp-card-image-wrap">
      <img
        src={instructor.profile_pic_url || '/default-avatar.jpg'}
        alt={`${instructor.first_name} ${instructor.last_name}`}
        className="cpbp-card-image"
      />
    </div>
    <h3 className="cpbp-card-title">{`${instructor.first_name} ${instructor.last_name}`}</h3>
    <p className="cpbp-card-description">
      {instructor.course_name || 'No course assigned'}
    </p>
    <div className="cpbp-card-actions">
      <button
        type="button"
        className="cpbp-btn-edit"
        onClick={() => onEdit(instructor)}
      >
        Details
      </button>
      <button
        type="button"
        className="cpbp-btn-delete"
        onClick={() => onDelete(instructor)}
      >
        Delete
      </button>
    </div>
  </div>
);

InstructorCard.propTypes = {
  instructor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    profile_pic_url: PropTypes.string,
    course_name: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default InstructorCard;
