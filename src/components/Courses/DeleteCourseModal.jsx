import React from 'react';
import PropTypes from 'prop-types';
import './DeleteCourseModal.css';

const DeleteCourseModal = ({
  isOpen,
  courseToDelete,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !courseToDelete) return null;

  return (
    <div className="cpbp-modal-overlay">
      <div className="cpbp-modal-content">
        <h2>Are you sure you want to delete this course?</h2>
        <p>
          <strong>{courseToDelete.course_name}</strong>
        </p>
        <div
          className="cpbp-form-buttons"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <button
            type="button"
            className="cpbp-btn-cancel"
            onClick={onCancel}
          >
            No
          </button>
          <button
            type="button"
            className="cpbp-btn-delete"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteCourseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  courseToDelete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course_name: PropTypes.string.isRequired,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

DeleteCourseModal.defaultProps = {
  courseToDelete: null,
};

export default DeleteCourseModal;
