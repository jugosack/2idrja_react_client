import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CourseCard.css';

const CourseCard = ({
  image,
  title,
  description,
  duration,
  discount,
  price,
  places,
  onDetailsClick,
  isAdmin,
  courseId,
}) => {
  console.log('CourseCard isAdmin:', isAdmin);

  const handleEnrollClick = () => {
    window.location.href = '/login';
  };

  const handleEditClick = () => {
    window.location.href = `/edit-course/${courseId}`;
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`http://localhost:3000/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Course deleted successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course.');
      }
    }
  };

  return (
    <div
      className="c-card d-flex flex-column justify-content-space-between align-items-center bg-silver"
      style={{ minWidth: '250px' }}
    >
      <img
        className="d-flex image-fluid rounded-top course-image"
        src={image}
        alt="course"
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
      />

      <div className="d-flex flex-column p-3 mt-3 rounded justify-content-center align-items-center w-100 text-center">
        <p className="cource-paragraph fs-3 fw-semibold">{title}</p>
        <p className="course-description fs-6 text-muted">{description}</p>
      </div>

      {/* ADMIN VIEW or USER VIEW */}
      {isAdmin ? (
        <div className="d-flex flex-column justify-content-center align-items-center w-100">
          <p className="text-danger fw-bold">Admin view: info hidden</p>
        </div>
      ) : (
        <>
          <div className="d-flex flex-row justify-content-center align-items-center w-100">
            <p className="cource-paragraph-date m-0">{duration}</p>
          </div>

          <div className="d-flex flex-row justify-content-center align-items-center w-100">
            {discount && (
              <p className="fs-2 text-secondary fw-bold me-4">
                <s>{discount}</s>
              </p>
            )}
            <p className="fs-2 text-dark fw-bold">{price}</p>
          </div>

          <div className="d-flex flex-row justify-content-center align-items-center w-100">
            <p className="places-left fs-4 text-danger">{places}</p>
          </div>
        </>
      )}

      <div className="d-flex flex-column px-5 pb-4 pt-3 mb-3 gap-2 w-100">
        <button
          type="button"
          className="btn btn-outline-secondary text-primary w-100"
          onClick={onDetailsClick}
        >
          Details
        </button>

        {isAdmin ? (
          <>
            <button
              type="button"
              className="btn btn-warning text-white w-100"
              onClick={handleEditClick}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger w-100"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn text-dark btn-custom w-100"
            onClick={handleEnrollClick}
          >
            Enroll now
          </button>
        )}
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  discount: PropTypes.string,
  price: PropTypes.string.isRequired,
  places: PropTypes.string.isRequired,
  onDetailsClick: PropTypes.func,
  isAdmin: PropTypes.bool,
  courseId: PropTypes.number.isRequired,
};

CourseCard.defaultProps = {
  discount: '',
  onDetailsClick: () => {},
  isAdmin: false,
};

export default CourseCard;
