import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Details from './HTMLdetails';
import ReviewModal from '../ReviewModal';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseIndex, setCourseIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewCourse, setReviewCourse] = useState(null);
  const location = useLocation();

  const coursesPerPage = 3;

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
    link.integrity = 'sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==';
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    document.head.appendChild(link);
  }, []);

  // Function to fetch enrolled courses
  const fetchEnrolledCourses = useCallback(() => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch current user
    axios.get('http://localhost:3000/current_user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUserData(res.data);
        // Fetch enrolled courses for this user
        return axios.get(`http://localhost:3000/users/${res.data.id}/enrolled_courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        // Filter out any enrolled courses where the course data is missing (deleted courses)
        const validEnrolledCourses = (res.data || []).filter(
          // Check if course data exists (course might be null if deleted)
          (enrollment) => enrollment && enrollment.id && enrollment.course_name,
        );
        setEnrolledCourses(validEnrolledCourses);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user or courses:', err);
        setLoading(false);
      });
  }, []);

  // Fetch courses on mount and when location changes (user navigates to dashboard)
  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses, location.pathname]);

  // Listen for enrollment success events to refresh courses
  useEffect(() => {
    const handleEnrollmentSuccess = () => {
      // Refresh enrolled courses when enrollment succeeds
      fetchEnrolledCourses();
    };

    // Listen for custom event dispatched after successful enrollment
    window.addEventListener('enrollment-success', handleEnrollmentSuccess);

    return () => {
      window.removeEventListener('enrollment-success', handleEnrollmentSuccess);
    };
  }, [fetchEnrolledCourses]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  // Helper function to calculate days left until end date
  const calculateDaysLeft = (endDate) => {
    if (!endDate) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Completed';
    if (diffDays === 0) return 'Ends today';
    if (diffDays === 1) return '1 Day left to finish';
    return `${diffDays} Days left to finish`;
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
    if (diffDays === 1) return 'Starts tomorrow';
    return `${diffDays} Days left to start`;
  };

  // Filter courses by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ongoingCourses = enrolledCourses.filter((course) => {
    if (!course.start_date || !course.end_date) return false;
    const startDate = new Date(course.start_date);
    const endDate = new Date(course.end_date);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return today >= startDate && today <= endDate;
  }).map((course) => ({
    id: course.id,
    month: formatDate(course.start_date),
    name: course.course_name,
    daysLeft: calculateDaysLeft(course.end_date),
    course, // Store full course data for details
  }));

  const pastCourses = enrolledCourses.filter((course) => {
    if (!course.end_date) return false;
    const endDate = new Date(course.end_date);
    endDate.setHours(0, 0, 0, 0);
    return today > endDate;
  }).map((course) => ({
    id: course.id,
    month: formatDate(course.start_date),
    name: course.course_name,
    daysLeft: '', // Empty for past courses to avoid duplicate "Completed"
    course, // Store full course data for details
  }));

  // Upcoming courses - start_date is in the future
  const upcomingCourses = enrolledCourses.filter((course) => {
    if (!course.start_date) return false;
    const startDate = new Date(course.start_date);
    startDate.setHours(0, 0, 0, 0);
    return today < startDate;
  }).map((course) => ({
    id: course.id,
    month: formatDate(course.start_date),
    name: course.course_name,
    daysLeft: calculateDaysUntilStart(course.start_date),
    course, // Store full course data for details
  }));

  // Courses without dates or that don't match any category - show in "All" or "Other"
  const otherCourses = enrolledCourses.filter((course) => {
    const isOngoing = ongoingCourses.some((oc) => oc.id === course.id);
    const isPast = pastCourses.some((pc) => pc.id === course.id);
    const isUpcoming = upcomingCourses.some((uc) => uc.id === course.id);
    return !isOngoing && !isPast && !isUpcoming;
  }).map((course) => {
    // Check if course hasn't started yet and show days until start
    let daysLeftText = 'Enrolled';
    if (course.start_date) {
      const startDate = new Date(course.start_date);
      startDate.setHours(0, 0, 0, 0);
      if (today < startDate) {
        daysLeftText = calculateDaysUntilStart(course.start_date);
      }
    }
    return {
      id: course.id,
      month: formatDate(course.start_date) || 'No date',
      name: course.course_name,
      daysLeft: daysLeftText,
      course, // Store full course data for details
    };
  });

  let visibleCourses = [];
  if (selectedCategory === 'ongoing') {
    visibleCourses = ongoingCourses.slice(courseIndex, courseIndex + coursesPerPage);
  } else if (selectedCategory === 'past') {
    visibleCourses = pastCourses.slice(courseIndex, courseIndex + coursesPerPage);
  } else if (selectedCategory === 'upcoming') {
    visibleCourses = upcomingCourses.slice(courseIndex, courseIndex + coursesPerPage);
  } else if (selectedCategory === 'all') {
    // Show all enrolled courses
    const allCourses = [...ongoingCourses, ...upcomingCourses, ...pastCourses, ...otherCourses];
    visibleCourses = allCourses.slice(courseIndex, courseIndex + coursesPerPage);
  }

  const handleNextCourses = () => {
    let courses = [];
    if (selectedCategory === 'ongoing') {
      courses = ongoingCourses;
    } else if (selectedCategory === 'past') {
      courses = pastCourses;
    } else if (selectedCategory === 'upcoming') {
      courses = upcomingCourses;
    } else if (selectedCategory === 'all') {
      courses = [...ongoingCourses, ...upcomingCourses, ...pastCourses, ...otherCourses];
    }
    if (courseIndex + coursesPerPage < courses.length) {
      setCourseIndex(courseIndex + coursesPerPage);
    }
  };

  const handlePrevCourses = () => {
    if (courseIndex - coursesPerPage >= 0) {
      setCourseIndex(courseIndex - coursesPerPage);
    }
  };

  const details = userData ? [
    { label: 'Name :', value: userData.first_name || 'N/A' },
    { label: 'Surname :', value: userData.last_name || 'N/A' },
    { label: 'Email address :', value: userData.email || 'N/A' },
    { label: 'Country :', value: userData.country || 'N/A' },
    { label: 'Contact number :', value: userData.mobile_number || 'N/A' },
    { label: 'Availability :', value: 'Schedule the time slot' },
  ] : [];

  const inboxMessages = [
    { sender: 'Stefan', message: 'Hey, tell me about this...' },
    { sender: 'Marko', message: 'Hey, tell me about this...' },
    { sender: 'Ivan', message: 'Hey, tell me about this...' },
    { sender: 'Anastasija', message: 'Hey, tell me about this...' },
  ];

  const categoryLabels = {
    ongoing: 'Ongoing Courses',
    past: 'Past Courses',
    upcoming: 'Upcoming Courses',
    all: 'All Enrolled Courses',
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <div className="navbar-dashboard">
        <h2 className="dashboard-title">Dashboard</h2>
        <div className="orange-navbar">
          <Link to="/">
            Home
            {' '}
            <i className="fas fa-home" />
          </Link>
          <a href="#courses">Courses</a>
          <a href="#settings">Settings</a>
        </div>
        <div className="navbar-icons">
          <button type="button" className="icon-btn">🔍</button>
          <button type="button" className="icon-btn">
            <img src="/logo192.png" alt="Profile" className="profile-icon" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-left">
            <img src={userData?.avatar_url || '/logo192.png'} alt="Profile" className="profile-pic" />
            <div className="icon-group">
              <button type="button" className="icon-btn">✉️</button>
              <button type="button" className="icon-btn">🎥</button>
            </div>
            <div className="time-slots">
              <h3>Time Slots</h3>
              <button type="button" className="month-btn">May 2025</button>
            </div>
          </div>
          <div className="profile-right">
            <div className="profile-info">
              <h2>{userData ? `${userData.first_name} ${userData.last_name}` : 'Loading...'}</h2>
              <p className="job-title">Student </p>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="ongoing-courses">
          <div className="dropdown-wrapper">
            <span className="category-label">{categoryLabels[selectedCategory]}</span>
            <div className="arrow-only-select-wrapper">
              <select
                className={`arrow-only-select select-${selectedCategory}`}
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCourseIndex(0);
                }}
              >
                <option value="all">All Enrolled Courses</option>
                <option value="ongoing">Ongoing Courses</option>
                <option value="upcoming">Upcoming Courses</option>
                <option value="past">Past Courses</option>
              </select>
              <i className="fas fa-chevron-down custom-arrow-icon" />
            </div>
          </div>

          <div className="course-navigation">
            <button
              type="button"
              onClick={handlePrevCourses}
              className="nav-arrow"
              disabled={courseIndex === 0}
            >
              ◀
            </button>

            <div className="courses-container">
              {(() => {
                if (loading) {
                  return (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      Loading courses...
                    </div>
                  );
                }
                if (visibleCourses.length === 0) {
                  const categoryTextMap = {
                    ongoing: 'ongoing',
                    past: 'past',
                    upcoming: 'upcoming',
                    all: 'enrolled',
                  };
                  const categoryText = categoryTextMap[selectedCategory] || 'courses';
                  return (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      No
                      {' '}
                      {categoryText}
                      {' '}
                      courses found.
                    </div>
                  );
                }
                return visibleCourses.map((course) => {
                  // Check if this course is past based on its end_date
                  const courseData = course.course || course;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const isCoursePast = courseData.end_date ? (() => {
                    const endDate = new Date(courseData.end_date);
                    endDate.setHours(0, 0, 0, 0);
                    return today > endDate;
                  })() : false;

                  // STEP 1: Check if course hasn't started yet - THIS IS THE KEY CHECK
                  let hasNotStarted = false;
                  const startDateStr = courseData.start_date;
                  if (startDateStr) {
                    try {
                      const startDate = new Date(startDateStr);
                      if (!Number.isNaN(startDate.getTime())) {
                        startDate.setHours(0, 0, 0, 0);
                        hasNotStarted = today < startDate;
                      }
                    } catch (e) {
                      console.error('Error parsing start_date:', e);
                    }
                  }

                  // STEP 2: Determine what to display for daysLeft
                  let daysLeftDisplay = '';
                  if (hasNotStarted && startDateStr) {
                    // Course hasn't started - ALWAYS calculate and show "X Days left to start"
                    daysLeftDisplay = calculateDaysUntilStart(startDateStr);
                  } else if (!isCoursePast && course.daysLeft) {
                    // Course has already started - show days until end
                    daysLeftDisplay = course.daysLeft;
                  }

                  return (
                    <div
                      className="course course-hover-container"
                      key={course.id || `${course.name}-${course.month}`}
                    >
                      <div className="course-month">{course.month}</div>
                      <div className="course-name">{course.name}</div>
                      {isCoursePast ? (
                        <>
                          <div className="completed-course-text">Completed course</div>
                          <button
                            type="button"
                            className="review-course-btn"
                            onClick={() => {
                              setReviewCourse(courseData);
                              setShowReviewModal(true);
                            }}
                          >
                            Review
                          </button>
                        </>
                      ) : (
                        <>
                          {daysLeftDisplay && (
                            <div className="days-left">{daysLeftDisplay}</div>
                          )}
                        </>
                      )}
                      <button
                        type="button"
                        className="course-info-btn"
                        onClick={() => {
                          setSelectedCourse(courseData);
                          setShowPopup(true);
                        }}
                      >
                        ⓘ
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            <button
              type="button"
              onClick={handleNextCourses}
              className="nav-arrow"
              disabled={(() => {
                if (selectedCategory === 'ongoing') {
                  return courseIndex + coursesPerPage >= ongoingCourses.length;
                }
                if (selectedCategory === 'past') {
                  return courseIndex + coursesPerPage >= pastCourses.length;
                }
                if (selectedCategory === 'upcoming') {
                  return courseIndex + coursesPerPage >= upcomingCourses.length;
                }
                if (selectedCategory === 'all') {
                  const allCourses = [
                    ...ongoingCourses,
                    ...upcomingCourses,
                    ...pastCourses,
                    ...otherCourses,
                  ];
                  return courseIndex + coursesPerPage >= allCourses.length;
                }
                return true;
              })()}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="detailed-info">
          <h3>Detailed Information</h3>
          {details.map((item) => (
            <div className="info-item" key={item.label}>
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="calendar">
          <div className="calendar-month">
            <button type="button" className="month-btn">Prev</button>
            <h3>June 2025</h3>
            <button type="button" className="month-btn">Next</button>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="calendar-day">{day}</div>
            ))}
            {[...Array(30)].map((_, i) => {
              const today = new Date();
              const isToday = today.getDate() === i + 1
                && today.getMonth() === 5 - 1
                && today.getFullYear() === 2025;
              return (
                <div
                  key={`day-${i + 1}`}
                  className={`calendar-day${isToday ? ' current-day' : ''}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Inbox */}
        <div className="inbox">
          <h3>Inbox ✉️</h3>
          {inboxMessages.map((msg) => (
            <div className="message" key={msg.sender}>
              <img src="logo192.png" alt={msg.sender} />
              <div>
                <div className="sender">{msg.sender}</div>
                <div className="message-text">
                  {msg.message}
                  {' '}
                  Waiting for response
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Popup */}
      {showPopup && selectedCourse && (
        <Details
          course={selectedCourse}
          onClose={() => setShowPopup(false)}
          isEnrolled
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        open={showReviewModal}
        course={reviewCourse ? { name: reviewCourse.course_name || reviewCourse.name } : null}
        onClose={() => {
          setShowReviewModal(false);
          setReviewCourse(null);
        }}
        onSubmit={async (reviewData) => {
          try {
            const token = sessionStorage.getItem('auth_token');
            if (!token) {
              throw new Error('You must be logged in to submit a review');
            }

            // Submit review to backend
            const response = await axios.post(
              `http://localhost:3000/courses/${reviewCourse.id}/reviews`,
              {
                rating: reviewData.rating,
                body: reviewData.body,
                title: reviewData.title || '',
                structured: reviewData.flags.structured,
                engaging: reviewData.flags.engaging,
                knowledgeable: reviewData.flags.knowledgeable,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            if (response.status === 201 || response.status === 200) {
              // Review submitted successfully
              setShowReviewModal(false);
              setReviewCourse(null);
              // Optionally refresh the page or show a success message
              alert('Review submitted successfully!');
            }
          } catch (error) {
            console.error('Error submitting review:', error);
            throw error; // Let ReviewModal handle the error display
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
