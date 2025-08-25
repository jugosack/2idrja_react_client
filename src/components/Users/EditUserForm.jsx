/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-associated-control, no-unused-vars, no-nested-ternary */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateUser, updateUserAlternative } from './UsersServices';
import './EditUserForm.css';

function EditUserForm({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      console.log('Setting form data from user:', user);
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    console.log('Previous form data:', formData);
    
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      console.log('New form data:', newData);
      return newData;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Debug logging
      console.log('Original user data:', user);
      console.log('Form data to send:', formData);
      console.log('User ID being sent:', user.id);
      
      // Use the simplified update method
      const result = await updateUser(user.id, formData);
      
      // Pass the updated user data back to the parent component
      onSave(result.user || result);
      
      // Show success message
      setSuccessMessage('User updated successfully!');
      
      // Close the form after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating user:', error);
      let errorMessage = 'Failed to update user';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 404) {
          errorMessage = 'User not found. Please refresh and try again.';
        } else if (error.response.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'Forbidden. You do not have permission to edit this user.';
        } else if (error.response.status === 422) {
          errorMessage = 'Invalid data. Please check your input.';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if no user data
  if (!user) {
    console.log('No user data provided to EditUserForm');
    return null;
  }

  return (
    <div className="edit-user-modal-overlay">
      <div className="edit-user-modal">
        <h2 className="edit-user-title">Edit User</h2>
        
        {successMessage && (
          <div className="edit-user-success-message">
            {successMessage}
          </div>
        )}
        
        <div className="edit-user-form-group">
          <label className="edit-user-label">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            placeholder="Enter first name"
            className="edit-user-input-field"
          />
        </div>

        <div className="edit-user-form-group">
          <label className="edit-user-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            placeholder="Enter last name"
            className="edit-user-input-field"
          />
        </div>

        <div className="edit-user-form-group">
          <label className="edit-user-label">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country || ''}
            onChange={handleChange}
            placeholder="Enter country"
            className="edit-user-input-field"
          />
        </div>

        <div className="edit-user-form-group">
          <label className="edit-user-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Enter email address"
            className="edit-user-input-field"
          />
        </div>

        <div className="edit-user-form-group">
          <label className="edit-user-label">Mobile Number</label>
          <input
            type="text"
            name="mobile_number"
            value={formData.mobile_number || ''}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="edit-user-input-field"
          />
        </div>

        <div className="edit-user-button-container">
          <button 
            onClick={handleSave} 
            className="edit-user-btn edit-user-btn-save"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={onClose} 
            className="edit-user-btn edit-user-btn-cancel"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

EditUserForm.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditUserForm;
