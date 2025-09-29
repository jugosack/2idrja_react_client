/* eslint-disable jsx-a11y/label-has-associated-control, no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  createCourse,
  updateCourse,
  uploadCourseImage,
  updateCourseImage,
  emptyCourseForm,
} from './CoursesServices';

const AddCourseForm = ({
  isOpen,
  onClose,
  isEditing = false,
  editingId = null,
  initialForm = emptyCourseForm,
  readOnly = false,
  onSuccess,
}) => {
  const [form, setForm] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when initialForm prop changes
  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleMaxStudentsChange = (e) => {
    let { value } = e.target;
    if (value === '') {
      setForm((f) => ({ ...f, max_students: '' }));
      return;
    }
    value = value.replace(/[^0-9]/g, '');
    if (value === '') {
      setForm((f) => ({ ...f, max_students: '' }));
      return;
    }
    const clamped = Math.max(0, Math.min(1000, parseInt(value, 10)));
    setForm((f) => ({ ...f, max_students: clamped }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select an image file first.');
      return;
    }

    if (!editingId) {
      setErrorMessage(
        'Please save the course first before uploading an image.',
      );
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await updateCourseImage(editingId, selectedFile);

      if (response.status >= 200 && response.status < 300) {
        setSelectedFile(null);
        setPreviewUrl('');
        setSuccessMessage('Image uploaded successfully!');

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrorMessage(`Upload failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setErrorMessage(
        'Image upload failed. Please check the console for details.',
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      let response;
      if (isEditing) {
        response = await updateCourse(editingId, form);
      } else {
        response = await createCourse(form);
      }

      // Upload image AFTER course is created or updated
      const courseId = isEditing ? editingId : response?.course?.id;
      if (courseId && selectedFile) {
        await uploadCourseImage(courseId, selectedFile);
      }

      setSuccessMessage(
        isEditing
          ? 'Course updated successfully!'
          : 'Course created successfully!',
      );
      setSelectedFile(null);
      setPreviewUrl('');

      // Close modal and clear success message after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Course save error:', err);
      setErrorMessage(
        'Failed to save course. Please check the console for details.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    if (!isEditing) return 'Add Course';
    if (readOnly) return 'Course Details';
    return 'Edit Course';
  };

  const modalTitle = getModalTitle();

  if (!isOpen) return null;

  return (
    <div className="cpbp-modal-overlay instructor-modal">
      <div className="cpbp-modal-content">
        <button
          type="button"
          className="cpbp-modal-close"
          onClick={() => {
            onClose();
            setSuccessMessage('');
            setErrorMessage('');
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '1rem' }}>{modalTitle}</h2>
        {errorMessage && (
          <div className="cpbp-error-message">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="cpbp-success-message">{successMessage}</div>
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
              <label htmlFor="course_image">Upload Image</label>
              <input
                id="course_image"
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
                disabled={!selectedFile || readOnly || !isEditing}
                style={{ marginTop: '0.5rem', color: '#fff' }}
              >
                Upload Image
              </button>
            </div>
          )}
          <div className="cpbp-form-buttons">
            {!isEditing && (
              <>
                <button
                  type="submit"
                  className="cpbp-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Add Course'}
                </button>
                <button
                  type="button"
                  className="cpbp-btn-cancel"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </>
            )}
            {isEditing && !readOnly && (
              <>
                <button
                  type="submit"
                  className="cpbp-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Update Course'}
                </button>
                <button
                  type="button"
                  className="cpbp-btn-cancel"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

AddCourseForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  editingId: PropTypes.number,
  initialForm: PropTypes.shape({
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
  }),
  readOnly: PropTypes.bool,
  onSuccess: PropTypes.func,
};

AddCourseForm.defaultProps = {
  isEditing: false,
  editingId: null,
  initialForm: emptyCourseForm,
  readOnly: false,
  onSuccess: null,
};

export default AddCourseForm;
