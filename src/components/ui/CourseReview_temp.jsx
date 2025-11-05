import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CourseReview.css';

const CourseReview = ({ course, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(course.rating || 0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        setError('Please login to submit a review');
        setSubmitting(false);
        return;
      }

      // Submit review to backend
      await axios.patch(
        `http://localhost:3000/courses/${course.id}`,
        {
          course: {
            rating,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess(true);
      setTimeout(() => {
        if (onReviewSubmitted) {
          onReviewSubmitted({ ...course, rating });
        }
        onClose();
      }, 1500);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error submitting review:', err);
      setError(err.response?.data?.errors?.[0] || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!course) return null;

  return (
    <div
      className="course-review-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div
        className="course-review-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
      >
        <button type="button" className="course-review-close" onClick={onClose}>
          ×
        </button>
        <div className="course-review-content" onClick={(e) => e.stopPropagation()}>
          <h2 id="review-title">
            Review Course:
            {course.course_name}
          </h2>

          {success ? (
            <div className="course-review-success">
              <p>✓ Review submitted successfully!</p>
            </fieldset>
          ) : (
            <form onSubmit={handleSubmit}>
              <fieldset className="course-review-rating">
                <legend>Rating</legend>
                <div className="star-rating" role="group" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${star <= rating ? 'filled' : ''}`}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setRating(star)}
                      aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </fieldset>
                <span className="rating-value">
                  {rating}
                  {' '}
                  out of 5
                </span>
              </fieldset>

              <div className="course-review-text">
                <label htmlFor="review-text">Review (Optional)</label>
                <textarea
                  id="review-text"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this course..."
                  rows={5}
                />
              </fieldset>

              {error && <div className="course-review-error">{error}</fieldset>}

              <div className="course-review-actions">
                <button type="button" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting || rating === 0}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </fieldset>
            </form>
          )}
        </fieldset>
      </fieldset>
    </fieldset>
  );
};

CourseReview.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course_name: PropTypes.string.isRequired,
    rating: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onReviewSubmitted: PropTypes.func,
};

CourseReview.defaultProps = {
  onReviewSubmitted: null,
};

export default CourseReview;
