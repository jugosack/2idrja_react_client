/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

const CourseModal = ({
  showModal,
  setShowModal,
  isEditing,
  readOnly,
  setReadOnly,
  modalTitle,
  form,
  handleChange,
  handleMaxStudentsChange,
  handleSubmit,
  handleFileChange,
  handleImageUpload,
  selectedFile,
  previewUrl,
  errorMessage,
}) => {
  if (!showModal) return null;

  return (
    <div className="cpbp-modal-overlay">
      <div className="cpbp-modal-content">
        <button
          type="button"
          className="cpbp-modal-close"
          onClick={() => setShowModal(false)}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '1rem' }}>{modalTitle}</h2>
        {errorMessage && (
          <div className="cpbp-error-message">{errorMessage}</div>
        )}
        <form className="cpbp-form" onSubmit={handleSubmit}>
          <div className="cpbp-form-group">
            <label htmlFor="course_name">Course Name</label>
            <input
              id="course_name"
              name="course_name"
              value={form.course_name}
              onChange={handleChange}
              required
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="start_date">Start Date</label>
            <input
              id="start_date"
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="end_date">End Date</label>
            <input
              id="end_date"
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="benefits">Benefits</label>
            <input
              id="benefits"
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="target_audience">Target Audience</label>
            <input
              id="target_audience"
              name="target_audience"
              value={form.target_audience}
              onChange={handleChange}
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="additional_info">Additional Info</label>
            <input
              id="additional_info"
              name="additional_info"
              value={form.additional_info}
              onChange={handleChange}
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="fee">Fee (€)</label>
            <input
              id="fee"
              type="number"
              step="0.01"
              name="fee"
              value={form.fee}
              onChange={handleChange}
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="max_students">Max Students</label>
            <input
              id="max_students"
              type="number"
              name="max_students"
              value={form.max_students}
              onChange={handleMaxStudentsChange}
              inputMode="numeric"
              min="0"
              max="1000"
              step="1"
              placeholder="e.g., 20"
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="course_status">Course Status</label>
            <select
              id="course_status"
              name="course_status"
              value={form.course_status}
              onChange={handleChange}
              disabled={isEditing && readOnly}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="rating">Rating</label>
            <input
              id="rating"
              type="number"
              step="0.1"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              disabled={isEditing && readOnly}
            />
          </div>
          <div className="cpbp-form-group">
            <label htmlFor="general_description">General Description</label>
            <textarea
              id="general_description"
              name="general_description"
              value={form.general_description}
              onChange={handleChange}
              disabled={isEditing && readOnly}
            />
          </div>
          {isEditing && (
            <div className="cpbp-form-group">
              <label htmlFor="upload_image">Upload Image</label>
              <input
                id="upload_image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={readOnly}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    marginTop: '0.5rem',
                    borderRadius: '4px',
                  }}
                />
              )}
              <button
                type="button"
                className="cpbp-btn-submit"
                onClick={handleImageUpload}
                disabled={!selectedFile || readOnly}
                style={{ marginTop: '0.5rem' }}
              >
                Upload Image
              </button>
            </div>
          )}
          <div
            className="cpbp-form-buttons"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {isEditing && readOnly && (
              <button
                type="button"
                className="cpbp-btn-edit"
                onClick={() => setReadOnly(false)}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className="cpbp-btn-cancel"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            {!isEditing && (
              <button type="submit" className="cpbp-btn-submit">
                Create
              </button>
            )}
            {isEditing && !readOnly && (
              <button type="submit" className="cpbp-btn-submit">
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

CourseModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  setReadOnly: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  form: PropTypes.shape({
    course_name: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    description: PropTypes.string,
    benefits: PropTypes.string,
    target_audience: PropTypes.string,
    additional_info: PropTypes.string,
    fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max_students: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    enrolled_students: PropTypes.number,
    course_status: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    general_description: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleMaxStudentsChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  selectedFile: PropTypes.instanceOf(File),
  previewUrl: PropTypes.string,
  errorMessage: PropTypes.string,
};

CourseModal.defaultProps = {
  selectedFile: null,
  previewUrl: '',
  errorMessage: '',
};

export default CourseModal;
