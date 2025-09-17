import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './EnrollNow.css';

const EnrollNow = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('token');

      const enrollmentData = {
        course_id: course.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
      };

      const response = await axios.post(
        'http://localhost:3000/enrollments',
        enrollmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Enrollment error:', err);
      setError(err.response?.data?.message || 'Failed to enroll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBackdropKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="enroll-modal-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
    >
      <div
        className="enroll-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-modal-title"
      >
        <div className="enroll-modal-header">
          <h3 id="enroll-modal-title">Enroll in Course</h3>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="course-info-section">
          <h4>{course.course_name}</h4>
          <div className="course-details">
            <p>
              <strong>Duration:</strong>
              {' '}
              {course.start_date}
              {' '}
              -
              {' '}
              {course.end_date}
            </p>
            <p>
              <strong>Price:</strong>
              {' '}
              €
              {course.fee}
            </p>
            <p className="places-available">
              <strong>Available Places:</strong>
              <span className={`places-count ${course.places_left <= 5 ? 'low' : ''}`}>
                {course.places_left}
                {' '}
                places left
              </span>
            </p>
          </div>
        </div>

        {success && (
          <div className="success-message" role="status">
            ✓ Successfully enrolled in the course! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="enroll-form">
          <div className="form-row">
            <div className="form-group">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="enroll-first-name">
                First Name *
              </label>
              <input
                type="text"
                id="enroll-first-name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="enroll-last-name">
                Last Name *
              </label>
              <input
                type="text"
                id="enroll-last-name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="enroll-email">
              Email Address *
            </label>
            <input
              type="email"
              id="enroll-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="enroll-phone">
              Phone Number *
            </label>
            <input
              type="tel"
              id="enroll-phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="+389 70 123 456"
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary enroll-submit"
              disabled={loading || course.places_left === 0}
            >
              {loading ? 'Processing...' : 'Confirm Enrollment'}
            </button>
          </div>
        </form>

        {course.places_left === 0 && (
          <div className="no-places-warning" role="alert">
            Sorry, this course is fully booked!
          </div>
        )}
      </div>
    </div>
  );
};

EnrollNow.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course_name: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    places_left: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EnrollNow;
