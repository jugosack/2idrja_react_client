import React from 'react';
import PropTypes from 'prop-types';

const InstructorsSection = ({
  instructors,
  isMobile,
  openInstructorEditModal,
  handleInstructorDelete,
  showPrevInstructor,
  showNextInstructor,
  currentInstructorIndex,
}) => (isMobile ? (
  <div className="instructors-slider">
    <button
      type="button"
      className="slider-arrow slider-arrow-left"
      onClick={showPrevInstructor}
      aria-label="Previous instructor"
    >
      ◀
    </button>
    <div className="slider-viewport">
      {instructors.length > 0 && (
      <div className="cpbp-card instructor-card">
        <div className="cpbp-card-image-wrap">
          <img
            src={
                  instructors[currentInstructorIndex]
                    ?.profile_pic_url || '/default-avatar.jpg'
                }
            alt={`${
              instructors[currentInstructorIndex]?.first_name
              || ''
            } ${
              instructors[currentInstructorIndex]?.last_name
              || ''
            }`}
            className="cpbp-card-image"
          />
        </div>
        <h3 className="cpbp-card-title">
          {`${
            instructors[currentInstructorIndex]?.first_name || ''
          } ${
            instructors[currentInstructorIndex]?.last_name || ''
          }`}
        </h3>
        <p className="cpbp-card-description">
          {instructors[currentInstructorIndex]?.course_name
            || 'No course assigned'}
        </p>
        <div className="cpbp-card-actions">
          <button
            type="button"
            className="cpbp-btn-edit"
            onClick={() => openInstructorEditModal(
              instructors[currentInstructorIndex],
            )}
          >
            Details
          </button>
          <button
            type="button"
            className="cpbp-btn-delete"
            onClick={() => handleInstructorDelete(
              instructors[currentInstructorIndex],
            )}
          >
            Delete
          </button>
        </div>
      </div>
      )}
    </div>
    <button
      type="button"
      className="slider-arrow slider-arrow-right"
      onClick={showNextInstructor}
      aria-label="Next instructor"
    >
      ▶
    </button>
  </div>
) : (
  <div className="cpbp-cards-container instructors-3col-desktop">
    {instructors.map((instructor) => (
      <div
        key={instructor.id}
        className="cpbp-card instructor-card"
      >
        <div className="cpbp-card-image-wrap">
          <img
            src={
                instructor.profile_pic_url || '/default-avatar.jpg'
              }
            alt={`${instructor.first_name} ${instructor.last_name}`}
            className="cpbp-card-image"
          />
        </div>
        <h3 className="cpbp-card-title">{`${instructor.first_name} ${instructor.last_name}`}</h3>
        <p className="cpbp-card-description">
          {instructor.course_name || 'No course assigned'}
        </p>
        <div className="cpbp-card-actions">
          <button
            type="button"
            className="cpbp-btn-edit"
            onClick={() => openInstructorEditModal(instructor)}
          >
            Details
          </button>
          <button
            type="button"
            className="cpbp-btn-delete"
            onClick={() => handleInstructorDelete(instructor)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
));

InstructorsSection.propTypes = {
  instructors: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    course_name: PropTypes.string,
    profile_pic_url: PropTypes.string,
  })).isRequired,
  isMobile: PropTypes.bool.isRequired,
  openInstructorEditModal: PropTypes.func.isRequired,
  handleInstructorDelete: PropTypes.func.isRequired,
  showPrevInstructor: PropTypes.func.isRequired,
  showNextInstructor: PropTypes.func.isRequired,
  currentInstructorIndex: PropTypes.number.isRequired,
};

export default InstructorsSection;
