import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import Details from "./HTMLdetails";
import ReviewModal from "../ReviewModal";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseIndex, setCourseIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewCourse, setReviewCourse] = useState(null);
  const [calendarDate, setCalendarDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const location = useLocation();

  const coursesPerPage = 3;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
    link.integrity =
      "sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==";
    link.crossOrigin = "anonymous";
    link.referrerPolicy = "no-referrer";
    document.head.appendChild(link);
  }, []);

  const fetchEnrolledCourses = useCallback(() => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:3000/current_user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);
        return axios.get(
          `http://localhost:3000/users/${res.data.id}/enrolled_courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
      .then((res) => {
        const validEnrolledCourses = (res.data || []).filter(
          (enrollment) => enrollment && enrollment.id && enrollment.course_name
        );
        setEnrolledCourses(validEnrolledCourses);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user or courses:", err);
        setEnrolledCourses([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses, location.pathname]);

  useEffect(() => {
    const handleEnrollmentSuccess = () => {
      fetchEnrolledCourses();
    };

    window.addEventListener("enrollment-success", handleEnrollmentSuccess);

    return () => {
      window.removeEventListener("enrollment-success", handleEnrollmentSuccess);
    };
  }, [fetchEnrolledCourses]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Completed";
    if (diffDays === 0) return "Ends today";
    if (diffDays === 1) return "1 Day left to finish";
    return `${diffDays} Days left to finish`;
  };

  const calculateDaysUntilStart = (startDate) => {
    if (!startDate) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return ""; // Course already started
    if (diffDays === 0) return "Starts today";
    if (diffDays === 1) return "Starts tomorrow";
    return `${diffDays} Days left to start`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ongoingCourses = enrolledCourses
    .filter((course) => {
      if (!course.start_date || !course.end_date) return false;
      const startDate = new Date(course.start_date);
      const endDate = new Date(course.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return today >= startDate && today <= endDate;
    })
    .map((course) => ({
      id: course.id,
      month: formatDate(course.start_date),
      name: course.course_name,
      daysLeft: calculateDaysLeft(course.end_date),
      course,
    }));

  const pastCourses = enrolledCourses
    .filter((course) => {
      if (!course.end_date) return false;
      const endDate = new Date(course.end_date);
      endDate.setHours(0, 0, 0, 0);
      return today > endDate;
    })
    .map((course) => ({
      id: course.id,
      month: formatDate(course.start_date),
      name: course.course_name,
      daysLeft: "", // Empty for past courses to avoid duplicate "Completed"
      course,
    }));

  const upcomingCourses = enrolledCourses
    .filter((course) => {
      if (!course.start_date) return false;
      const startDate = new Date(course.start_date);
      startDate.setHours(0, 0, 0, 0);
      return today < startDate;
    })
    .map((course) => ({
      id: course.id,
      month: formatDate(course.start_date),
      name: course.course_name,
      daysLeft: calculateDaysUntilStart(course.start_date),
      course,
    }));

  const otherCourses = enrolledCourses
    .filter((course) => {
      const isOngoing = ongoingCourses.some((oc) => oc.id === course.id);
      const isPast = pastCourses.some((pc) => pc.id === course.id);
      const isUpcoming = upcomingCourses.some((uc) => uc.id === course.id);
      return !isOngoing && !isPast && !isUpcoming;
    })
    .map((course) => {
      let daysLeftText = "Enrolled";
      if (course.start_date) {
        const startDate = new Date(course.start_date);
        startDate.setHours(0, 0, 0, 0);
        if (today < startDate) {
          daysLeftText = calculateDaysUntilStart(course.start_date);
        }
      }
      return {
        id: course.id,
        month: formatDate(course.start_date) || "No date",
        name: course.course_name,
        daysLeft: daysLeftText,
        course,
      };
    });

  let visibleCourses = [];
  if (selectedCategory === "ongoing") {
    visibleCourses = ongoingCourses.slice(
      courseIndex,
      courseIndex + coursesPerPage
    );
  } else if (selectedCategory === "past") {
    visibleCourses = pastCourses.slice(
      courseIndex,
      courseIndex + coursesPerPage
    );
  } else if (selectedCategory === "upcoming") {
    visibleCourses = upcomingCourses.slice(
      courseIndex,
      courseIndex + coursesPerPage
    );
  } else if (selectedCategory === "all") {
    const allCourses = [
      ...ongoingCourses,
      ...upcomingCourses,
      ...pastCourses,
      ...otherCourses,
    ];
    visibleCourses = allCourses.slice(
      courseIndex,
      courseIndex + coursesPerPage
    );
  }

  const handleNextCourses = () => {
    let courses = [];
    if (selectedCategory === "ongoing") {
      courses = ongoingCourses;
    } else if (selectedCategory === "past") {
      courses = pastCourses;
    } else if (selectedCategory === "upcoming") {
      courses = upcomingCourses;
    } else if (selectedCategory === "all") {
      courses = [
        ...ongoingCourses,
        ...upcomingCourses,
        ...pastCourses,
        ...otherCourses,
      ];
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

  const details = userData
    ? [
        { label: "Name :", value: userData.first_name || "N/A" },
        { label: "Surname :", value: userData.last_name || "N/A" },
        { label: "Email address :", value: userData.email || "N/A" },
        { label: "Country :", value: userData.country || "N/A" },
        { label: "Contact number :", value: userData.mobile_number || "N/A" },
        { label: "Availability :", value: "Schedule the time slot" },
      ]
    : [];

  const inboxMessages = [
    { sender: "Stefan", message: "Hey, tell me about this..." },
    { sender: "Marko", message: "Hey, tell me about this..." },
    { sender: "Ivan", message: "Hey, tell me about this..." },
    { sender: "Anastasija", message: "Hey, tell me about this..." },
  ];

  const categoryLabels = {
    ongoing: "Ongoing Courses",
    past: "Past Courses",
    upcoming: "Upcoming Courses",
    all: "All Enrolled Courses",
  };

  const calendarMonthName = calendarDate.toLocaleString("default", {
    month: "long",
  });
  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
  const calendarCells = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, idx) => idx + 1),
    ...Array(totalCells - (firstDayIndex + daysInMonth)).fill(null),
  ];

  const handlePrevMonth = () => {
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return (
    <div className="dashboard-container">
      <div className="navbar-dashboard">
        <h2 className="dashboard-title">Dashboard</h2>
        <div className="orange-navbar">
          <Link to="/">
            Home <i className="fas fa-home" />
          </Link>
          <a href="#courses">Courses</a>
          <a href="#settings">Settings</a>
        </div>
        <div className="navbar-icons">
          <button type="button" className="icon-btn">
            🔍
          </button>
          <button type="button" className="icon-btn">
            <img src="/logo192.png" alt="Profile" className="profile-icon" />
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="profile-section">
          <div className="profile-left">
            <img
              src={userData?.avatar_url || "/logo192.png"}
              alt="Profile"
              className="profile-pic"
            />
            <div className="icon-group">
              <button type="button" className="icon-btn">
                ✉️
              </button>
              <button type="button" className="icon-btn">
                🎥
              </button>
            </div>
            <div className="time-slots">
              <h3>Time Slots</h3>
              <button type="button" className="month-btn">
                May 2025
              </button>
            </div>
          </div>
          <div className="profile-right">
            <div className="profile-info">
              <h2>
                {userData
                  ? `${userData.first_name} ${userData.last_name}`
                  : "Loading..."}
              </h2>
              <p className="job-title">Student </p>
            </div>
          </div>
        </div>

        <div className="ongoing-courses">
          <div className="dropdown-wrapper">
            <span className="category-label">
              {categoryLabels[selectedCategory]}
            </span>
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
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      Loading courses...
                    </div>
                  );
                }
                if (visibleCourses.length === 0) {
                  const categoryTextMap = {
                    ongoing: "ongoing",
                    past: "past",
                    upcoming: "upcoming",
                    all: "enrolled",
                  };
                  const categoryText =
                    categoryTextMap[selectedCategory] || "courses";
                  return (
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      No {categoryText} courses found.
                    </div>
                  );
                }
                return visibleCourses.map((course) => {
                  const courseData = course.course || course;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const isCoursePast = courseData.end_date
                    ? (() => {
                        const endDate = new Date(courseData.end_date);
                        endDate.setHours(0, 0, 0, 0);
                        return today > endDate;
                      })()
                    : false;

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
                      console.error("Error parsing start_date:", e);
                    }
                  }

                  let daysLeftDisplay = "";
                  if (hasNotStarted && startDateStr) {
                    daysLeftDisplay = calculateDaysUntilStart(startDateStr);
                  } else if (!isCoursePast && course.daysLeft) {
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
                          <div className="completed-course-text">
                            Completed course
                          </div>
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
                if (selectedCategory === "ongoing") {
                  return courseIndex + coursesPerPage >= ongoingCourses.length;
                }
                if (selectedCategory === "past") {
                  return courseIndex + coursesPerPage >= pastCourses.length;
                }
                if (selectedCategory === "upcoming") {
                  return courseIndex + coursesPerPage >= upcomingCourses.length;
                }
                if (selectedCategory === "all") {
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

        <div className="detailed-info">
          <h3>Detailed Information</h3>
          {details.map((item) => (
            <div className="info-item" key={item.label}>
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="calendar">
          <div className="calendar-month">
            <button
              type="button"
              className="month-btn"
              onClick={handlePrevMonth}
            >
              Prev
            </button>
            <h3>
              {calendarMonthName} {calendarYear}
            </h3>
            <button
              type="button"
              className="month-btn"
              onClick={handleNextMonth}
            >
              Next
            </button>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="calendar-day calendar-heading">
                {day}
              </div>
            ))}
            {calendarCells.map((day, index) => {
              const isToday =
                day !== null &&
                today.getDate() === day &&
                today.getMonth() === calendarMonth &&
                today.getFullYear() === calendarYear;

              const dayEvents = [];
              if (day !== null) {
                const cellDate = new Date(calendarYear, calendarMonth, day);
                cellDate.setHours(0, 0, 0, 0);

                const allCalendarCourses = [...enrolledCourses];

                allCalendarCourses.forEach((course) => {
                  if (!course.start_date) return;

                  const startDate = new Date(course.start_date);
                  if (Number.isNaN(startDate.getTime())) return;
                  startDate.setHours(0, 0, 0, 0);

                  const endDateRaw = course.end_date
                    ? new Date(course.end_date)
                    : null;
                  const endDate =
                    endDateRaw && !Number.isNaN(endDateRaw.getTime())
                      ? new Date(endDateRaw.setHours(0, 0, 0, 0))
                      : null;

                  if (endDate && endDate < today) return;

                  const isDateWithinCourse =
                    startDate <= cellDate && (!endDate || cellDate <= endDate);

                  if (!isDateWithinCourse) return;

                  const hasStarted =
                    startDate <= today && (!endDate || endDate >= today);
                  const isUpcomingCourse = startDate > today;

                  if (hasStarted) {
                    dayEvents.push({
                      type: "started",
                      courseName: course.course_name,
                      courseId: course.id,
                    });
                  } else if (isUpcomingCourse) {
                    dayEvents.push({
                      type: "upcoming",
                      courseName: course.course_name,
                      courseId: course.id,
                    });
                  }
                });
              }

              const eventTypes = dayEvents.map((event) => event.type);
              const hasStartedEvent = eventTypes.includes("started");
              const hasUpcomingEvent = eventTypes.includes("upcoming");

              const cellKey =
                day === null
                  ? `empty-${calendarYear}-${calendarMonth}-${index}`
                  : `day-${calendarYear}-${calendarMonth}-${day}`;

              let eventClass = "";
              if (hasStartedEvent) {
                eventClass = " event-started";
              } else if (hasUpcomingEvent) {
                eventClass = " event-upcoming";
              }

              return (
                <div
                  key={cellKey}
                  className={`calendar-day${
                    day === null ? " empty" : ""
                  }${eventClass}${isToday ? " current-day" : ""}${
                    dayEvents.length ? " has-event" : ""
                  }`}
                >
                  <span className="calendar-day-number">{day ?? ""}</span>
                  {dayEvents.length > 0 && (
                    <>
                      <div className="calendar-event-dots">
                        {dayEvents.map((event) => (
                          <span
                            key={`${event.courseId}-${event.type}`}
                            className={`event-dot dot-${event.type}`}
                          />
                        ))}
                      </div>
                      <div className="calendar-event-card">
                        <div className="calendar-card-header">
                          <h4>Courses</h4>
                          <span className="calendar-card-date">
                            {calendarMonthName} {day}
                          </span>
                        </div>
                        {hasStartedEvent && (
                          <div className="calendar-card-section started-section">
                            <div className="section-header">
                              <span className="section-dot dot-started" />
                              <span className="section-title">Started</span>
                            </div>
                            <ul className="course-list">
                              {dayEvents
                                .filter((event) => event.type === "started")
                                .map((event) => (
                                  <li key={`${event.courseId}-started`}>
                                    {event.courseName}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                        {hasUpcomingEvent && (
                          <div className="calendar-card-section upcoming-section">
                            <div className="section-header">
                              <span className="section-dot dot-upcoming" />
                              <span className="section-title">Upcoming</span>
                            </div>
                            <ul className="course-list">
                              {dayEvents
                                .filter((event) => event.type === "upcoming")
                                .map((event) => (
                                  <li key={`${event.courseId}-upcoming`}>
                                    {event.courseName}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot dot-started" />
              <span>Started</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-upcoming" />
              <span>Upcoming</span>
            </div>
          </div>
        </div>

        <div className="inbox">
          <h3>Inbox ✉️</h3>
          {inboxMessages.map((msg) => (
            <div className="message" key={msg.sender}>
              <img src="logo192.png" alt={msg.sender} />
              <div>
                <div className="sender">{msg.sender}</div>
                <div className="message-text">
                  {msg.message} Waiting for response
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && selectedCourse && (
        <Details
          course={selectedCourse}
          onClose={() => setShowPopup(false)}
          isEnrolled
        />
      )}

      <ReviewModal
        open={showReviewModal}
        course={
          reviewCourse
            ? { name: reviewCourse.course_name || reviewCourse.name }
            : null
        }
        onClose={() => {
          setShowReviewModal(false);
          setReviewCourse(null);
        }}
        onSubmit={async (reviewData) => {
          try {
            const token = sessionStorage.getItem("auth_token");
            if (!token) {
              throw new Error("You must be logged in to submit a review");
            }

            const response = await axios.post(
              `http://localhost:3000/courses/${reviewCourse.id}/reviews`,
              {
                rating: reviewData.rating,
                body: reviewData.body,
                title: reviewData.title || "",
                structured: reviewData.flags.structured,
                engaging: reviewData.flags.engaging,
                knowledgeable: reviewData.flags.knowledgeable,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (response.status === 201 || response.status === 200) {
              setShowReviewModal(false);
              setReviewCourse(null);
              alert("Review submitted successfully!");
            }
          } catch (error) {
            console.error("Error submitting review:", error);
            throw error;
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
