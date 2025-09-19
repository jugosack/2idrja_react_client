import React from 'react';
import PropTypes from 'prop-types';
import './DeleteInstructorModal.css';

const DeleteInstructorModal = ({
  isOpen,
  instructorToDelete,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !instructorToDelete) return null;

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
            onClick={onConfirm}
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
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteInstructorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  instructorToDelete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

DeleteInstructorModal.defaultProps = {
  instructorToDelete: null,
};

export default DeleteInstructorModal;
