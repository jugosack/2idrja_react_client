/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-associated-control, no-unused-vars, no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import './UserDetailsModal.css';

function UserDetailsModal({ user, onClose, onEdit, onDelete }) {
  if (!user) return null;

  return (
    <div className="user-details-modal-overlay" onClick={onClose}>
      <div className="user-details-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="user-details-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="user-details-header">
          <h2 className="user-details-title">User Details</h2>
        </div>
        
        <div className="user-details-body">
          <div className="user-detail-row">
            <span className="user-detail-label">ID:</span>
            <span className="user-detail-value">{user.id}</span>
          </div>
          
          <div className="user-detail-row">
            <span className="user-detail-label">First Name:</span>
            <span className="user-detail-value">{user.first_name}</span>
          </div>
          
          <div className="user-detail-row">
            <span className="user-detail-label">Last Name:</span>
            <span className="user-detail-value">{user.last_name}</span>
          </div>
          
          <div className="user-detail-row">
            <span className="user-detail-label">Country:</span>
            <span className="user-detail-value">{user.country}</span>
          </div>
          
          <div className="user-detail-row">
            <span className="user-detail-label">Email:</span>
            <span className="user-detail-value">{user.email}</span>
          </div>
          
          <div className="user-detail-row">
            <span className="user-detail-label">Mobile Number:</span>
            <span className="user-detail-value">{user.mobile_number}</span>
          </div>
        </div>
        
        <div className="user-details-actions">
          <button
            type="button"
            className="user-details-btn-edit"
            onClick={() => onEdit(user)}
          >
            Edit
          </button>
          <button
            type="button"
            className="user-details-btn-delete"
            onClick={() => onDelete(user.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

UserDetailsModal.propTypes = {
  user: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserDetailsModal;
