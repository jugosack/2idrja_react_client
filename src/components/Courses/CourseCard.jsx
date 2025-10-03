import React from 'react';
import PropTypes from 'prop-types';
import './CourseCard.css';

const CourseCard = ({ course, onEdit, onDelete }) => (
  <div className="cpbp-card">
    <img
      src={course.image_url || '/default-course.jpg'}
      alt={course.course_name}
      className="cpbp-card-image"
    />
    <h3 className="cpbp-card-title">{course.course_name}</h3>
    <div className="cpbp-card-actions">
      <button
        type="button"
        className="cpbp-btn-edit"
        onClick={() => onEdit(course)}
      >
        Details
      </button>
      <button
        type="button"
        className="cpbp-btn-delete"
        onClick={() => onDelete(course)}
      >
        Delete
      </button>
    </div>
  </div>
);

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course_name: PropTypes.string.isRequired,
    image_url: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CourseCard;
