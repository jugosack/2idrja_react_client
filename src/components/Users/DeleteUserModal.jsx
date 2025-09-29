/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";

function DeleteUserModal({ user, onClose, onDelete }) {
  console.log("🔍 DeleteUserModal rendered with user:", user);
  console.log("🔍 User prop type:", typeof user);
  console.log(
    "🔍 User keys:",
    user ? Object.keys(user) : "user is null/undefined"
  );

  const handleDelete = () => {
    if (!user?.id) {
      console.error("❌ User ID is missing or undefined:", user);
      alert("Error: User ID is missing. Please refresh and try again.");
      return;
    }

    console.log("🔍 Delete confirmed for user:", user.id);
    onDelete(user.id);
    onClose();
  };

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
              <h3 className="cpbp-delete-title">Delete User</h3>
              <div className="cpbp-delete-message-container">
                <p className="cpbp-delete-message">
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="cpbp-delete-modal-actions">
          <button
            type="button"
            className="cpbp-btn-delete-confirm"
            onClick={handleDelete}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "1px solid #dc3545",
            }}
          >
            Confirm
          </button>
          <button type="button" className="cpbp-btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteUserModal.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteUserModal;
