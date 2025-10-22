import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Details from './HTMLdetails';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [courseIndex, setCourseIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('ongoing');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;

    axios.get('http://localhost:3000/current_user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUserData(res.data))
      .catch((err) => console.error('Error fetching user:', err));
  }, []);

  const ongoingCourses = [
    { month: 'March, 2025', name: 'HTML', daysLeft: '5 Days left' },
    { month: 'April, 2025', name: 'CSS', daysLeft: '11 Days left' },
    { month: 'August, 2025', name: 'Ruby', daysLeft: '5 Days left' },
    { month: 'November, 2025', name: 'React & JS', daysLeft: '6 Days left' },
    { month: 'December, 2025', name: 'Spring', daysLeft: '10 Days left' },
    { month: 'January, 2026', name: 'Python', daysLeft: '21 Days left' },
  ];

  const pastCourses = [
    { month: 'January, 2025', name: 'Java', daysLeft: 'Completed' },
    { month: 'February, 2025', name: 'C#', daysLeft: 'Completed' },
  ];

  const upcomingCourses = [
    { month: 'June, 2025', name: 'Node.js', daysLeft: '20 Days left' },
    { month: 'July, 2025', name: 'Docker', daysLeft: '25 Days left' },
    { month: 'September, 2025', name: 'Kubernetes', daysLeft: '30 Days left' },
  ];

  let visibleCourses = [];
  if (selectedCategory === 'ongoing') {
    visibleCourses = ongoingCourses.slice(courseIndex, courseIndex + coursesPerPage);
  } else if (selectedCategory === 'past') {
    visibleCourses = pastCourses.slice(0, 2);
  } else if (selectedCategory === 'upcoming') {
    visibleCourses = upcomingCourses.slice(0, 3);
  }

  const handleNextCourses = () => {
    if (selectedCategory === 'ongoing' && courseIndex + coursesPerPage < ongoingCourses.length) {
      setCourseIndex(courseIndex + coursesPerPage);
    }
  };

  const handlePrevCourses = () => {
    if (selectedCategory === 'ongoing' && courseIndex - coursesPerPage >= 0) {
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
                <option value="ongoing">Ongoing Courses</option>
                <option value="past">Past Courses</option>
                <option value="upcoming">Upcoming Courses</option>
              </select>
              <i className="fas fa-chevron-down custom-arrow-icon" />
            </div>
          </div>

          <div className="course-navigation">
            <button
              type="button"
              onClick={handlePrevCourses}
              className="nav-arrow"
              disabled={courseIndex === 0 || selectedCategory !== 'ongoing'}
            >
              ◀
            </button>

            <div className="courses-container">
              {visibleCourses.map((course) => (
                <div className="course" key={`${course.name}-${course.month}`}>
                  <div className="course-month">{course.month}</div>
                  <div className="course-name">{course.name}</div>
                  <div className="progress-text">
                    {selectedCategory === 'past' ? 'Completed' : 'Progress 33%'}
                  </div>
                  <div className="days-left">{course.daysLeft}</div>
                  <button
                    type="button"
                    className="course-info-btn"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowPopup(true);
                    }}
                  >
                    ⓘ
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextCourses}
              className="nav-arrow"
              disabled={courseIndex + coursesPerPage >= ongoingCourses.length || selectedCategory !== 'ongoing'}
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
        />
      )}
    </div>
  );
};

export default Dashboard;
