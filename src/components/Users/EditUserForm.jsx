/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-associated-control, no-unused-vars, no-nested-ternary */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { updateUser, updateUserAlternative } from "./UsersServices";

function EditUserForm({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      console.log("Setting form data from user:", user);
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input change:", name, value);
    console.log("Previous form data:", formData);

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      console.log("New form data:", newData);
      return newData;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Debug logging
      console.log("Original user data:", user);
      console.log("Form data to send:", formData);
      console.log("User ID being sent:", user.id);

      // Use the simplified update method
      const result = await updateUser(user.id, formData);

      // Pass the updated user data back to the parent component
      onSave(result.user || result);

      // Show success message
      setSuccessMessage("User updated successfully!");

      // Close the form after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      let errorMessage = "Failed to update user";

      if (error.response) {
        // Server responded with error status
        if (error.response.status === 404) {
          errorMessage = "User not found. Please refresh and try again.";
        } else if (error.response.status === 401) {
          errorMessage = "Unauthorized. Please log in again.";
        } else if (error.response.status === 403) {
          errorMessage =
            "Forbidden. You do not have permission to edit this user.";
        } else if (error.response.status === 422) {
          errorMessage = "Invalid data. Please check your input.";
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message || "Unknown error occurred";
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if no user data
  if (!user) {
    console.log("No user data provided to EditUserForm");
    return null;
  }

  return (
    <div className="cpbp-modal-overlay instructor-modal">
      <div className="cpbp-modal-content">
        <button type="button" className="cpbp-modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Edit User</h2>

        {successMessage && (
          <div className="cpbp-success-message">{successMessage}</div>
        )}

        <form
          className="cpbp-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="cpbp-form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cpbp-form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              id="mobile_number"
              type="tel"
              name="mobile_number"
              value={formData.mobile_number || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cpbp-form-buttons">
            <button
              type="submit"
              className="cpbp-btn-submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Update User"}
            </button>
            <button
              type="button"
              className="cpbp-btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
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
