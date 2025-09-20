/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardNavigation from "./DashboardNavigation";
import CourseManagement from "./CourseManagement";
import InstructorManagement from "./InstructorManagement";
import UserManagement from "./UserManagement";
import { useAuth, useResponsive, useCarousel } from "../hooks";
import "./CoursesPanelPage.css";
import "../modals/modals.css";


export default function CoursesPanelPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Courses");
  const { user, getAuthHeaders } = useAuth();
  const { isMobile } = useResponsive();
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [courses, setCourses] = useState([]);

  const sections = ["Courses", "Users", "Instructors"];

  // Simple course loading function
  const loadCourses = () => {
    // This will be handled by the CourseManagement component
  };

  // mount/unmount body class
  useEffect(() => {
    document.body.classList.add("admin-dashboard-bg");
    return () => document.body.classList.remove("admin-dashboard-bg");
  }, []);

  // theme toggle
  useEffect(() => {
    document.body.classList.toggle("light-theme", isLightTheme);
  }, [isLightTheme]);


  const goHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    navigate("/login");
  };

  const openAddModal = () => {
    // This will be handled by the respective management components
  };

  return (
    <div className="cpbp-dashboard-container">
      <DashboardHeader
        user={user}
        activeSection={activeSection}
        openAddModal={openAddModal}
        isLightTheme={isLightTheme}
        setIsLightTheme={setIsLightTheme}
      />

      <div className="cpbp-dashboard-body">
        <DashboardNavigation
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          goHome={goHome}
          handleLogout={handleLogout}
        />

        <div className="cpbp-panel content-panel">
          <main className="cpbp-dashboard-content">
            {activeSection === "Courses" ? (
              <CourseManagement
                getAuthHeaders={getAuthHeaders}
                setPage={() => {}}
              />
            ) : activeSection === "Users" ? (
              <UserManagement />
            ) : activeSection === "Instructors" ? (
              <InstructorManagement
                courses={courses}
                loadCourses={loadCourses}
                isMobile={isMobile}
              />
            ) : (
              <p className="cpbp-placeholder">
                {activeSection} view not implemented yet.
              </p>
            )}
          </main>
        </div>
      </div>

    </div>
  );
}
