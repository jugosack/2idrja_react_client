import React from 'react';
import PropTypes from 'prop-types';
import InstructorCard from './InstructorCard';
import './InstructorsTable.css';

const InstructorsTable = ({
  instructors,
  onEdit,
  onDelete,
  isMobile = false,
  currentInstructorIndex = 0,
  onPrevInstructor,
  onNextInstructor,
}) => {
  if (isMobile) {
    return (
      <div className="instructors-slider">
        <button
          type="button"
          className="slider-arrow slider-arrow-left"
          onClick={onPrevInstructor}
          aria-label="Previous instructor"
        >
          ◀
        </button>
        <div className="slider-viewport">
          {instructors.length > 0 && (
            <InstructorCard
              instructor={instructors[currentInstructorIndex]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </div>
        <button
          type="button"
          className="slider-arrow slider-arrow-right"
          onClick={onNextInstructor}
          aria-label="Next instructor"
        >
          ▶
        </button>
      </div>
    );
  }

  return (
    <div className="cpbp-cards-container instructors-3col-desktop">
      {instructors.map((instructor) => (
        <InstructorCard
          key={instructor.id}
          instructor={instructor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

InstructorsTable.propTypes = {
  instructors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      profile_pic_url: PropTypes.string,
      course_name: PropTypes.string,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  currentInstructorIndex: PropTypes.number,
  onPrevInstructor: PropTypes.func.isRequired,
  onNextInstructor: PropTypes.func.isRequired,
};

InstructorsTable.defaultProps = {
  isMobile: false,
  currentInstructorIndex: 0,
};

export default InstructorsTable;
