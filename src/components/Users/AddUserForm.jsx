/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-associated-control, no-unused-vars, no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createUser } from './UsersServices';
import './AddUserForm.css';

const AddUserForm = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    country: '',
    mobile_number: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.mobile_number) {
      newErrors.mobile_number = 'Mobile number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createUser(formData);
      console.log('User created successfully:', response);
      
      // Call the callback to refresh the users list
      if (onUserAdded) {
        onUserAdded();
      }
      
      // Close the form
      onClose();
      
      // Show success message
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.response.data.errors.forEach(errorMsg => {
          if (errorMsg.includes('Email')) {
            backendErrors.email = errorMsg;
          } else if (errorMsg.includes('Password')) {
            backendErrors.password = errorMsg;
          } else if (errorMsg.includes('First name')) {
            backendErrors.first_name = errorMsg;
          } else if (errorMsg.includes('Last name')) {
            backendErrors.last_name = errorMsg;
          } else if (errorMsg.includes('Country')) {
            backendErrors.country = errorMsg;
          } else if (errorMsg.includes('Mobile number')) {
            backendErrors.mobile_number = errorMsg;
          } else {
            backendErrors.general = errorMsg;
          }
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Failed to create user. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cpbp-modal-overlay">
      <div className="cpbp-modal-content">
        <button
          type="button"
          className="cpbp-modal-close"
          onClick={onClose}
        >
          ×
        </button>
        <h2>Add New User</h2>
        
        {errors.general && (
          <div className="cpbp-error-message">{errors.general}</div>
        )}
        
        <form className="cpbp-form" onSubmit={handleSubmit}>
          <div className="cpbp-form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="password_confirmation">Confirm Password *</label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={errors.password_confirmation ? 'error' : ''}
            />
            {errors.password_confirmation && <span className="error-message">{errors.password_confirmation}</span>}
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="first_name">First Name *</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? 'error' : ''}
            />
            {errors.first_name && <span className="error-message">{errors.first_name}</span>}
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="last_name">Last Name *</label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={errors.last_name ? 'error' : ''}
            />
            {errors.last_name && <span className="error-message">{errors.last_name}</span>}
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="country">Country *</label>
            <input
              id="country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={errors.country ? 'error' : ''}
            />
            {errors.country && <span className="error-message">{errors.country}</span>}
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="mobile_number">Mobile Number *</label>
            <input
              id="mobile_number"
              type="tel"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              className={errors.mobile_number ? 'error' : ''}
            />
            {errors.mobile_number && <span className="error-message">{errors.mobile_number}</span>}
          </div>



          <div className="add-user-form-buttons">
            <button
              type="button"
              className="add-user-form-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-user-form-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddUserForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUserAdded: PropTypes.func.isRequired
};

export default AddUserForm;
