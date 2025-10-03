import React from 'react';
import PropTypes from 'prop-types';

const DeleteConfirmationModal = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  courseToDelete,
  confirmDeleteCourse,
  isInstructor = false,
  instructorToDelete,
  setInstructorToDelete,
  confirmDeleteInstructor,
  showDeleteInstructorModal,
  setShowDeleteInstructorModal,
}) => {
  // Course delete modal
  if (showDeleteConfirm && courseToDelete && !isInstructor) {
    return (
      <div className="cpbp-modal-overlay">
        <div className="cpbp-delete-modal-container">
          <div className="cpbp-delete-modal-content">
            <div className="cpbp-delete-modal-header">
              <div className="cpbp-delete-icon-container">
                <svg
                  className="cpbp-delete-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z" />
                </svg>
              </div>
              <div className="cpbp-delete-modal-body">
                <h3 className="cpbp-delete-title">Delete Course</h3>
                <div className="cpbp-delete-message-container">
                  <p className="cpbp-delete-message">
                    Are you sure you want to delete this course? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="cpbp-delete-modal-actions">
            <button
              type="button"
              className="cpbp-btn-delete-confirm"
              onClick={confirmDeleteCourse}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: '1px solid #dc3545',
              }}
            >
              Confirm
            </button>
            <button
              type="button"
              className="cpbp-btn-cancel"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Instructor delete modal
  if (showDeleteInstructorModal && instructorToDelete) {
    return (
      <div className="cpbp-modal-overlay instructor-modal">
        <div className="cpbp-modal-content">
          <div className="cpbp-delete-modal-content">
            <div className="cpbp-delete-modal-header">
              <div className="cpbp-delete-icon-container">
                <svg
                  className="cpbp-delete-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z" />
                </svg>
              </div>
              <div className="cpbp-delete-modal-body">
                <h3 className="cpbp-delete-title">Delete Instructor</h3>
                <div className="cpbp-delete-message-container">
                  <p className="cpbp-delete-message">
                    Are you sure you want to delete instructor
                    {' '}
                    <span className="cpbp-delete-item-name">
                      {instructorToDelete.first_name}
                      {' '}
                      {instructorToDelete.last_name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="cpbp-delete-modal-actions">
            <button
              type="button"
              className="cpbp-btn-delete-confirm"
              onClick={confirmDeleteInstructor}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: '1px solid #dc3545',
              }}
            >
              Confirm
            </button>
            <button
              type="button"
              className="cpbp-btn-cancel"
              onClick={() => {
                setShowDeleteInstructorModal(false);
                setInstructorToDelete(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

DeleteConfirmationModal.propTypes = {
  showDeleteConfirm: PropTypes.bool.isRequired,
  setShowDeleteConfirm: PropTypes.func.isRequired,
  courseToDelete: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    course_name: PropTypes.string,
  }),
  confirmDeleteCourse: PropTypes.func.isRequired,
  isInstructor: PropTypes.bool,
  instructorToDelete: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
  setInstructorToDelete: PropTypes.func,
  confirmDeleteInstructor: PropTypes.func,
  showDeleteInstructorModal: PropTypes.bool,
  setShowDeleteInstructorModal: PropTypes.func,
};

DeleteConfirmationModal.defaultProps = {
  courseToDelete: null,
  isInstructor: false,
  instructorToDelete: null,
  setInstructorToDelete: null,
  confirmDeleteInstructor: null,
  showDeleteInstructorModal: false,
  setShowDeleteInstructorModal: null,
};

export default DeleteConfirmationModal;
