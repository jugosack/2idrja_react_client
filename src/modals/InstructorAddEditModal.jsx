/* eslint-disable */
import InstructorForm from "../Forms/InstructorForm";
import "./InstructorModal.css";

export default function InstructorAddEditModal({
  open,
  onClose,
  instructorForm,
  isEditing,
  readOnly,
  errorMessage,
  instructorPhotoPreview,
  handleInstructorChange,
  handlePhotoChange,
  handleSubmit,
  handleEdit,
  courses = [],
}) {
  if (!open) return null;

  const modalTitle = isEditing
    ? readOnly
      ? "Instructor Details"
      : "Edit Instructor"
    : "Add Instructor";

  return (
    <div className="cpbp-modal-overlay instructor-modal">
      <div className="cpbp-modal-content">
        <button type="button" className="cpbp-modal-close" onClick={onClose}>
          ×
        </button>
        <h2>{modalTitle}</h2>
        {errorMessage && (
          <div className="cpbp-error-message">{errorMessage}</div>
        )}

        <form className="cpbp-form" onSubmit={handleSubmit}>
          <InstructorForm
            form={instructorForm}
            onChange={handleInstructorChange}
            readOnly={readOnly}
            courses={courses}
          />

          {!readOnly && (
            <div className="cpbp-form-group">
              <label>Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {instructorPhotoPreview &&
                instructorPhotoPreview.startsWith("blob:") && (
                  <img
                    src={instructorPhotoPreview}
                    alt="Preview"
                    style={{
                      display: "block",
                      maxWidth: "200px",
                      maxHeight: "200px",
                      marginTop: "1rem",
                      borderRadius: "4px",
                    }}
                  />
                )}
            </div>
          )}

          <div className="cpbp-form-buttons">
            {isEditing && readOnly ? (
              <>
                <button
                  type="button"
                  className="cpbp-btn-submit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEdit();
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="cpbp-btn-cancel"
                  onClick={onClose}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button type="submit" className="cpbp-btn-submit">
                  {isEditing ? "Update Instructor" : "Add Instructor"}
                </button>
                <button
                  type="button"
                  className="cpbp-btn-cancel"
                  onClick={onClose}
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
}
