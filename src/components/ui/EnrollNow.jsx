import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import EnrollmentPopup from './EnrollmentPopup'; // ✅ додадено
import './EnrollNow.css';

const EnrollNow = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [loading] = useState(false);
  const [success] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true); // loading current_user
  const [error, setError] = useState('');

  const [isPopupOpen, setPopupOpen] = useState(false); // ✅ додадено

  // Close on ESC
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Prefill from /current_user
  useEffect(() => {
    const run = async () => {
      setError('');
      setFetchingUser(true);
      try {
        // Prefer 'auth_token', fallback to 'token'
        const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('token');

        if (!token) {
          setError('You must be logged in to enroll.');
          return;
        }

        const res = await axios.get('http://localhost:3000/current_user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data; // { id, email, first_name, last_name, mobile_number, ... }
        setFormData({
          firstName: u.first_name || '',
          lastName: u.last_name || '',
          email: u.email || '',
          phoneNumber: u.mobile_number || '',
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Fetch current_user error:', err);
        setError(
          err.response?.data?.message
            || 'Unable to load your profile. Please try again.',
        );
      } finally {
        setFetchingUser(false);
      }
    };
    run();
  }, []);

  // ✅ само отвори попап (НЕ праќај enrollment уште)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (course.places_left === 0) return;
    setPopupOpen(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleBackdropKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <>
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
                {' '}
                <span
                  className={`places-count ${
                    course.places_left <= 5 ? 'low' : ''
                  }`}
                >
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
            <fieldset className="form-fieldset" disabled={fetchingUser}>
              <div className="form-row">
                <div className="form-group">
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="enroll-first-name">First Name *</label>
                  <input
                    type="text"
                    id="enroll-first-name"
                    name="firstName"
                    value={formData.firstName}
                    className="form-control read-only"
                    placeholder="Enter your first name"
                    disabled
                    aria-readonly="true"
                    title="Edit in your profile"
                  />
                </div>

                <div className="form-group">
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="enroll-last-name">Last Name *</label>
                  <input
                    type="text"
                    id="enroll-last-name"
                    name="lastName"
                    value={formData.lastName}
                    className="form-control read-only"
                    placeholder="Enter your last name"
                    disabled
                    aria-readonly="true"
                    title="Edit in your profile"
                  />
                </div>
              </div>

              <div className="form-group">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="enroll-email">Email Address *</label>
                <input
                  type="email"
                  id="enroll-email"
                  name="email"
                  value={formData.email}
                  className="form-control read-only"
                  placeholder="your.email@example.com"
                  disabled
                  aria-readonly="true"
                  title="Edit in your profile"
                />
              </div>

              <div className="form-group">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="enroll-phone">Phone Number *</label>
                <input
                  type="tel"
                  id="enroll-phone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  className="form-control read-only"
                  placeholder="+389 70 123 456"
                  disabled
                  aria-readonly="true"
                  title="Edit in your profile"
                />
              </div>
            </fieldset>

            {fetchingUser && (
              <div className="info-message" role="status">
                Loading your profile…
              </div>
            )}

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
                disabled={
                  loading
                  || fetchingUser
                  || !formData.firstName
                  || !formData.lastName
                  || !formData.email
                  || !formData.phoneNumber
                  || course.places_left === 0
                }
              >
                {loading ? 'Processing...' : 'Pay Now'}
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

      <EnrollmentPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        course={{
          id: course.id,
          course_name: course.course_name,
          price: Number(course.fee),
        }}
        defaultUser={{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        }}
        onSubmit={() => {
          // Овде можеш да повикаш API ако сакаш.
          setPopupOpen(false);
        }}
      />
    </>
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
