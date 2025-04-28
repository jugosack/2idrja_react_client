// Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.warn('No JWT token found in localStorage.');
      return;
    }

    axios.get('http://localhost:3000/current_user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
      });
  }, []);

  const courses = [
    { month: 'March, 2025', name: 'HTML', daysLeft: '5 Days left' },
    { month: 'April, 2025', name: 'CSS', daysLeft: '11 Days left' },
    { month: 'August, 2025', name: 'Ruby', daysLeft: '5 Days left' },
    { month: 'November, 2025', name: 'React & JS', daysLeft: '6 Days left' },
    { month: 'December, 2025', name: 'Spring', daysLeft: '10 Days left' },
  ];

  const details = userData ? [
    { label: 'Name :', value: userData.name },
    { label: 'Surname :', value: userData.surname },
    { label: 'Email address :', value: userData.email },
    { label: 'Country :', value: userData.country },
    { label: 'Contact number :', value: userData.contact_number },
    { label: 'Availability :', value: 'Schedule the time slot' },
  ] : [];

  const inboxMessages = [
    { sender: 'Stefan', message: 'Hey, tell me about this...' },
    { sender: 'Marko', message: 'Hey, tell me about this...' },
    { sender: 'Ivan', message: 'Hey, tell me about this...' },
    { sender: 'Anastasija', message: 'Hey, tell me about this...' },
  ];

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <h2 className="dashboard-title">Dashboard</h2>
        <div className="orange-navbar">
          <Link to="/">Home</Link>
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

      <div className="main-content">
        <div className="profile-section">
          <div className="profile-left">
            <img src="/logo192.png" alt="Profile" className="profile-pic" />
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
              <h2>{userData ? `${userData.name} ${userData.surname}` : 'Loading...'}</h2>
              <p className="job-title">website designer</p>
            </div>
          </div>
        </div>

        <div className="ongoing-courses">
          <h3 className="ongoing-courses-title">Ongoing Courses</h3>
          <div className="courses-container">
            {courses.map((course) => (
              <div className="course" key={`${course.name}-${course.month}`}>
                <div className="course-month">{course.month}</div>
                <div className="course-name">{course.name}</div>
                <div className="progress-text">Progress 33%</div>
                <div className="days-left">{course.daysLeft}</div>
                <button type="button" className="course-info-btn">ⓘ</button>
              </div>
            ))}
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
            <button type="button" className="month-btn">Prev</button>
            <h3>April 2025</h3>
            <button type="button" className="month-btn">Next</button>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="calendar-day">{day}</div>
            ))}
            {[...Array(30)].map((_, i) => {
              const today = new Date();
              const isToday = today.getDate() === i + 1
                && today.getMonth() === 3
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
    </div>
  );
};

export default Dashboard;
