import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CourseCard from './CourseCard';
import './CoursesTable.css';

const CoursesTable = ({
  courses,
  onEdit,
  onDelete,
  page,
  setPage,
  cols,
  rows,
}) => {
  const pageSize = useMemo(() => cols * rows, [cols]);

  const totalPages = useMemo(() => {
    const total = Math.ceil((courses?.length || 0) / Math.max(1, pageSize)) || 1;
    return total;
  }, [courses, pageSize]);

  const currentItems = useMemo(() => {
    const start = page * pageSize;
    return courses.slice(start, start + pageSize);
  }, [courses, page, pageSize]);

  const jumpTo = (idx) => setPage(idx);

  return (
    <div className="cpbp-cards-container">
      {currentItems.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {/* Carousel navigation buttons */}
      <button
        type="button"
        className="cpbp-carousel-btn cpbp-carousel-prev"
        onClick={() => setPage((p) => (p > 0 ? p - 1 : totalPages - 1))}
        aria-label="Previous"
      >
        &#10094;
      </button>

      <button
        type="button"
        className="cpbp-carousel-btn cpbp-carousel-next"
        onClick={() => setPage((p) => (p < totalPages - 1 ? p + 1 : 0))}
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
                key={`page-dot-${idx}-${totalPages}`}
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
};

CoursesTable.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      course_name: PropTypes.string.isRequired,
      image_url: PropTypes.string,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  cols: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
};

export default CoursesTable;
