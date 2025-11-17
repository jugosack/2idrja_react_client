/* eslint-disable */
import React, { useState, useEffect } from "react";
import "./Calendar.css";
import { getEnrolledCourses } from "../../services/CourseService";

const Calendar = () => {
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDisplayMonth(new Date());

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const courses = await getEnrolledCourses();

        const courseMap = {};
        const statusDisplay = {
          ongoing: { type: "ongoing", label: "In Progress" },
          planned: { type: "upcoming", label: "Upcoming" },
        };

        courses.forEach((course) => {
          if (!course.start_date) {
            return;
          }

          const dateKey = course.start_date.split("T")[0];
          const statusKey = (course.course_status || "planned").toLowerCase();
          if (!statusDisplay[statusKey]) {
            return;
          }

          const { type, label } = statusDisplay[statusKey];

          const formattedEndDate = course.end_date
            ? course.end_date.split("T")[0]
            : null;

          const courseEntry = {
            id: course.id || `${dateKey}-${Math.random()}`,
            name: course.course_name || "Untitled Course",
            type,
            status: label,
            rawStatus: statusKey,
            startDate: dateKey,
            endDate: formattedEndDate,
          };

          if (!courseMap[dateKey]) {
            courseMap[dateKey] = [];
          }
          courseMap[dateKey].push(courseEntry);
        });

        setCourseData(courseMap);
      } catch (error) {
        console.error("Error fetching courses for calendar:", error);
        setCourseData({});
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      displayMonth.getMonth() === today.getMonth() &&
      displayMonth.getFullYear() === today.getFullYear()
    );
  };

  const getCoursesForDate = (day) => {
    const dateStr = `${displayMonth.getFullYear()}-${String(
      displayMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return courseData[dateStr] || [];
  };

  const handlePrevMonth = () => {
    setDisplayMonth(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setDisplayMonth(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1)
    );
  };

  const handleToday = () => {
    setDisplayMonth(new Date());
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayMonth);
    const firstDay = getFirstDayOfMonth(displayMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const coursesForDay = getCoursesForDate(day);
      const statusClasses = coursesForDay
        .map((item) => item.type)
        .filter(Boolean);
      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day ${isCurrentDay ? "current-day" : ""} ${
            coursesForDay.length > 0
              ? `has-course ${Array.from(new Set(statusClasses)).join(" ")}`
              : ""
          }`}
          onMouseEnter={() =>
            setHoveredDate(
              coursesForDay.length > 0 ? { day, courses: coursesForDay } : null
            )
          }
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
          {coursesForDay.length > 0 && (
            <div className="course-indicators">
              {coursesForDay.slice(0, 3).map((course, index) => (
                <span
                  key={`${course.id}-${index}`}
                  className={`course-pill ${course.type}`}
                  title={`${course.name} • ${course.status}`}
                  aria-label={`${course.name} is ${course.status}`}
                />
              ))}
              {coursesForDay.length > 3 && (
                <span className="course-pill more" aria-label="More courses">
                  +{coursesForDay.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-month">
        <button type="button" className="month-btn" onClick={handlePrevMonth}>
          Prev
        </button>
        <h3>{getMonthName(displayMonth)}</h3>
        <button type="button" className="month-btn" onClick={handleNextMonth}>
          Next
        </button>
        <button type="button" className="today-btn" onClick={handleToday}>
          Today
        </button>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {/* Course Tooltip */}
      {hoveredDate && hoveredDate.courses && hoveredDate.courses.length > 0 && (
        <div className="course-tooltip">
          <div className="tooltip-content">
            <h4>
              {displayMonth.toLocaleString("default", { month: "long" })}{" "}
              {hoveredDate.day}, {displayMonth.getFullYear()}
            </h4>
            <ul className="course-list">
              {hoveredDate.courses.map((course) => (
                <li key={`${course.id}-${course.rawStatus}`}>
                  <div className="course-list-header">
                    <span className="course-list-name">{course.name}</span>
                    <span className={`course-status-badge ${course.type}`}>
                      {course.status}
                    </span>
                  </div>
                  {course.endDate && course.endDate !== course.startDate && (
                    <p className="course-date-range">
                      Ends{" "}
                      {new Date(course.endDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Course Legend */}
      <div className="course-legend">
        <div className="legend-items">
          {[
            { key: "ongoing", label: "In Progress" },
            { key: "upcoming", label: "Upcoming" },
          ].map((item) => (
            <div className="legend-item" key={item.key}>
              <div className={`legend-color ${item.key}`}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
