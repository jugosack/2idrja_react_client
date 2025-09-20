import React from 'react';
import PropTypes from 'prop-types';

const CoursesGrid = ({
  currentItems,
  openEditModal,
  handleDeleteClick,
  page,
  totalPages,
  courses,
  pageSize,
  jumpTo,
  goToPrevious,
  goToNext,
}) => (
  <div className="cpbp-cards-container">
    {currentItems.map((course) => (
      <div key={course.id} className="cpbp-card">
        <img
          src={course.image_url || '/default-course.jpg'}
          alt={course.course_name}
          className="cpbp-card-image"
        />
        <h3 className="cpbp-card-title">{course.course_name}</h3>
        <div className="cpbp-card-actions">
          <button
            type="button"
            className="cpbp-btn-edit"
            onClick={() => openEditModal(course)}
          >
            Details
          </button>
          <button
            type="button"
            className="cpbp-btn-delete"
            onClick={() => handleDeleteClick(course)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}

    {/* Carousel navigation buttons */}
    <button
      type="button"
      className="cpbp-carousel-btn cpbp-carousel-prev"
      onClick={goToPrevious}
      aria-label="Previous"
    >
      &#10094;
    </button>

    <button
      type="button"
      className="cpbp-carousel-btn cpbp-carousel-next"
      onClick={goToNext}
      aria-label="Next"
    >
      &#10095;
    </button>

    {/* Carousel pagination for courses section */}
    {courses.length > pageSize && (
    <div className="cpbp-page-indicator">
      <span className="cpbp-page-label">
        Page
        {' '}
        {Math.min(page + 1, totalPages)}
        {' '}
        of
        {' '}
        {totalPages}
      </span>
      <div className="cpbp-dots">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={`page-${idx + 1}`}
            type="button"
            className={`cpbp-dot${idx === page ? ' active' : ''}`}
            onClick={() => jumpTo(idx)}
            aria-label={`Go to page ${idx + 1}`}
          />
        ))}
      </div>
    </div>
    )}
  </div>
);

CoursesGrid.propTypes = {
  currentItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    course_name: PropTypes.string.isRequired,
    image_url: PropTypes.string,
  })).isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  courses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    course_name: PropTypes.string.isRequired,
    image_url: PropTypes.string,
  })).isRequired,
  pageSize: PropTypes.number.isRequired,
  jumpTo: PropTypes.func.isRequired,
  goToPrevious: PropTypes.func.isRequired,
  goToNext: PropTypes.func.isRequired,
};

export default CoursesGrid;
