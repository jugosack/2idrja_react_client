import React from 'react';
import PropTypes from 'prop-types';
import './SuccessPopup.css';

export default function SuccessPopup({ onClose }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="success-overlay"
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      aria-label="Close success popup"
    >
      <div
        className="success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
      >
        <div className="success-icon">✅</div>

        <h2 id="success-title" className="success-title">
          Payment Successful!
        </h2>

        <div className="success-box">
          <p className="success-message">
            Your payment has been processed successfully. 🎉 The course has been
            added to your
            {' '}
            <strong>dashboard</strong>
            .
          </p>
        </div>

        <button
          type="button"
          className="success-btn"
          onClick={onClose}
          aria-label="Go to Dashboard"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

SuccessPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};
