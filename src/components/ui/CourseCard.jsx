import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import EnrollNow from './EnrollNow';
import './CourseCard.css';

const CourseCard = ({
  image,
  title,
  description,
  duration,
  discount = '',
  price,
  places,
  onDetailsClick = () => {},
  isAdmin = false,
  courseId,
}) => {
  console.log('CourseCard isAdmin:', isAdmin);

  // State to control the EnrollNow modal
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Create course object for EnrollNow modal
  const courseData = {
    id: courseId,
    course_name: title,
    start_date: duration.split(' - ')[0],
    end_date: duration.split(' - ')[1],
    fee: price.replace('€', ''),
    places_left: parseInt(places.split(' ')[0], 10),
  };

  // Helper function to calculate days until course starts
  const calculateDaysUntilStart = (startDate) => {
    if (!startDate) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return ''; // Course already started
    if (diffDays === 0) return 'Starts today';
    if (diffDays === 1) return '1 Day left to start';
    return `${diffDays} Days left to start`;
  };

  const daysUntilStart = calculateDaysUntilStart(courseData.start_date);

  // Check if user is enrolled in this course (only if logged in and not admin)
  const checkEnrollment = useCallback(async () => {
    if (isAdmin) {
      setIsEnrolled(false);
      return;
    }

    const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('token');
    if (!token) {
      setIsEnrolled(false);
      return;
    }

    try {
      const userRes = await axios.get('http://localhost:3000/current_user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enrolledRes = await axios.get(
        `http://localhost:3000/users/${userRes.data.id}/enrolled_courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const enrolledCourseIds = (enrolledRes.data || [])
        .filter((enrollment) => enrollment && enrollment.id)
        .map((enrollment) => enrollment.id);

      setIsEnrolled(enrolledCourseIds.includes(courseId));
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setIsEnrolled(false);
    }
  }, [courseId, isAdmin]);

  useEffect(() => {
    checkEnrollment();
  }, [checkEnrollment]);

  // Listen for enrollment success events to refresh enrollment status
  useEffect(() => {
    const handleEnrollmentSuccess = () => {
      // Refresh enrollment status when enrollment succeeds
      checkEnrollment();
    };

    // Listen for custom event dispatched after successful enrollment
    window.addEventListener('enrollment-success', handleEnrollmentSuccess);

    return () => {
      window.removeEventListener('enrollment-success', handleEnrollmentSuccess);
    };
  }, [checkEnrollment]);

  const handleEnrollClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't allow enrollment if already enrolled
    if (isEnrolled) {
      return;
    }

    const token = sessionStorage.getItem('auth_token');
    console.log('Token exists:', !!token);
    console.log('Opening enrollment modal for course:', courseData);

    if (!token) {
      alert('Please login first to enroll in a course');
      window.location.href = '/login';
    } else {
      setShowEnrollModal(true);
    }
  };

  const handleCloseEnrollModal = () => {
    console.log('Closing enrollment modal...');
    setShowEnrollModal(false);
  };

  const handleEnrollSuccess = () => {
    // Update enrollment status immediately when enrollment succeeds
    setIsEnrolled(true);
    setShowEnrollModal(false);
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
    <>
      <div
        className={`c-card d-flex flex-column justify-content-space-between align-items-center bg-silver ${
          isEnrolled ? 'enrolled-glass' : ''
        }`}
        style={{ minWidth: '250px' }}
      >
        <img
          className="d-flex image-fluid rounded-top course-image"
          src={image}
          alt="course"
          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
        />

        <div className="d-flex flex-column p-3 mt-3 rounded
        justify-content-center align-items-center w-100 text-center"
        >
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

            {daysUntilStart && (
              <div className="d-flex flex-row justify-content-center align-items-center w-100 mt-2">
                <p className="fs-5 text-primary fw-semibold">{daysUntilStart}</p>
              </div>
            )}
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
            !isEnrolled && (
              <button
                type="button"
                className="btn text-dark btn-custom w-100"
                onClick={handleEnrollClick}
              >
                Enroll now
              </button>
            )
          )}
        </div>
      </div>

      {/* Render the EnrollNow modal */}
      {showEnrollModal && (
        <EnrollNow
          course={courseData}
          onClose={handleCloseEnrollModal}
          onEnrollSuccess={handleEnrollSuccess}
        />
      )}
    </>
  );
};

CourseCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  discount: PropTypes.string,
  price: PropTypes.string.isRequired,
  places: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  onDetailsClick: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  isAdmin: PropTypes.bool,
  courseId: PropTypes.number.isRequired,
};

export default CourseCard;
