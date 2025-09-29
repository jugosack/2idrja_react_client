/* eslint-disable */
import React from "react";
import "./modals.css";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  itemType,
  itemName,
}) {
  if (!open) return null;

  return (
    <div className="cpbp-modal-overlay">
      <div className="cpbp-delete-modal-container">
        <div className="cpbp-delete-modal-content">
          <div className="cpbp-delete-modal-header">
            <div className="cpbp-delete-icon-container">
              <svg
                className="cpbp-delete-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="cpbp-delete-modal-body">
              <h3 className="cpbp-delete-title">Delete {itemType}</h3>
              <div className="cpbp-delete-message-container">
                <p className="cpbp-delete-message">
                  Are you sure you want to delete this {itemType.toLowerCase()}?
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
