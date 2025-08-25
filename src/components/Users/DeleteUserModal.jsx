/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import './DeleteUserModal.css';

function DeleteUserModal({ user, onClose, onDelete }) {
  console.log('🔍 DeleteUserModal rendered with user:', user);
  console.log('🔍 User prop type:', typeof user);
  console.log('🔍 User keys:', user ? Object.keys(user) : 'user is null/undefined');
  
  const handleDelete = () => {
    if (!user?.id) {
      console.error('❌ User ID is missing or undefined:', user);
      alert('Error: User ID is missing. Please refresh and try again.');
      return;
    }
    
    console.log('🔍 Delete confirmed for user:', user.id);
    onDelete(user.id);
    onClose();
  };

  return (
    <div className="delete-user-modal-overlay">
      <div className="delete-user-modal">
        {/* Close Icon */}
        <span className="delete-user-close-icon" onClick={onClose}>
          &#10006;
        </span>
        
        <div className="delete-user-title">Are you sure?</div>
        <div className="delete-user-message">
          Do you really want to delete this user? This process cannot be undone.
        </div>
        
        {/* Button container */}
        <div className="delete-user-button-container">
          <button className="delete-user-btn delete-user-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-user-btn delete-user-btn-delete" onClick={handleDelete}>
            Delete
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
