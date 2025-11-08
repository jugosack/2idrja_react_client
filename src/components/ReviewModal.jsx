/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import './ReviewModal.css';

const ReviewModal = ({
  open, course, onClose, onSubmit,
}) => {
  const uid = useId();

  const ids = {
    heading: `${uid}-heading`,
    ratingGroup: `${uid}-rating-group`,
    ratingHint: `${uid}-rating-hint`,
    title: `${uid}-title`,
    body: `${uid}-body`,
    flagsGroup: `${uid}-flags`,
    error: `${uid}-error`,
  };

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState('');
  const [flags, setFlags] = useState({
    structured: false,
    engaging: false,
    knowledgeable: false,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setBody('');
      setRating('');
      setFlags({ structured: false, engaging: false, knowledgeable: false });
      setError('');
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const toggleFlag = (k) => setFlags((f) => ({ ...f, [k]: !f[k] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rating) { setError('Please select a rating.'); return; }
    if (!body.trim()) { setError('Please write your review.'); return; }

    setSubmitting(true);
    try {
      await onSubmit({
        course,
        title: title.trim(),
        body: body.trim(),
        rating: Number(rating),
        flags,
      });
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  };

  const modal = (
    <div className="rm-overlay" role="dialog" aria-modal="true" aria-labelledby={ids.heading}>
      <button
        type="button"
        className="rm-backdrop"
        aria-label="Close review modal"
        onClick={onClose}
      />
      <div className="rm-card" role="document" tabIndex={-1} onMouseDown={(e) => e.stopPropagation()}>
        <header className="rm-header">
          <div className="rm-header-content">
            <h2 id={ids.heading} className="rm-title">
              Leave a Review
            </h2>
            {course?.name && (
              <p className="rm-course-name">{course.name}</p>
            )}
          </div>
          <button type="button" className="rm-close" aria-label="Close" onClick={onClose}>×</button>
        </header>

        <form className="rm-form" onSubmit={handleSubmit} noValidate aria-describedby={error ? ids.error : undefined}>

          {/* ⭐ Rating */}
          <div className="rm-rating" role="group" aria-labelledby={ids.ratingGroup} aria-describedby={ids.ratingHint}>
            <span id={ids.ratingGroup} className="rm-label">Rating</span>
            <div className="rm-stars-container">
              <span style={{ fontSize: '14px', color: '#555' }}>Poor</span>
              <div className="rm-star-row">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`rm-star ${Number(rating) >= n ? 'is-active' : ''}`}
                    aria-pressed={rating === String(n)}
                    aria-label={`Rating ${n} star`}
                    onClick={() => setRating(String(n))}
                  >
                    <span aria-hidden="true">★</span>
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '14px', color: '#555' }}>Excellent</span>
            </div>
          </div>
          {/* 💬 Body */}
          <div className="form-field">
            <span className="rm-field-label">Write your review</span>
            <textarea
              id={ids.body}
              className="review-textarea"
              placeholder="Write your review..."
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              aria-label="Review text"
            />
          </div>

          {/* ✅ Highlights (vertical + check icons) */}
          <div className="review-flags-section" role="group" aria-labelledby={ids.flagsGroup}>
            <span id={ids.flagsGroup} className="rm-field-label">Highlights (optional)</span>

            <button
              type="button"
              className={`flag-item ${flags.structured ? 'active' : ''}`}
              aria-pressed={flags.structured}
              onClick={() => toggleFlag('structured')}
            >
              <span className="flag-check" aria-hidden="true">✓</span>
              <span>Well-structured</span>
            </button>

            <button
              type="button"
              className={`flag-item ${flags.engaging ? 'active' : ''}`}
              aria-pressed={flags.engaging}
              onClick={() => toggleFlag('engaging')}
            >
              <span className="flag-check" aria-hidden="true">✓</span>
              <span>Engaging content</span>
            </button>

            <button
              type="button"
              className={`flag-item ${flags.knowledgeable ? 'active' : ''}`}
              aria-pressed={flags.knowledgeable}
              onClick={() => toggleFlag('knowledgeable')}
            >
              <span className="flag-check" aria-hidden="true">✓</span>
              <span>Knowledgeable instructor</span>
            </button>
          </div>

          {error && <div id={ids.error} className="review-error" role="alert">{error}</div>}

          <div className="actions">
            <button type="button" className="rm-btn-outlined" onClick={onClose}>Cancel</button>
            <button type="submit" className="rm-btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

ReviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  course: PropTypes.shape({ name: PropTypes.string }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

ReviewModal.defaultProps = { course: { name: '' } };

export default ReviewModal;
