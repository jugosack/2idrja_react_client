/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardNavigation from "./DashboardNavigation";
import CourseManagement from "./CourseManagement";
import UserManagement from "./UserManagement";
import InstructorManagement from "./InstructorManagement";
import { useAuth } from "../hooks";
import createCourseHandlers from "../handlers/courseHandlers";
import createUserHandlers from "../handlers/userHandlers";
import createNavigationHandlers from "../handlers/navigationHandlers";
import "./CoursesPanelPage.css";
import "../modals/modals.css";

export default function CoursesPanelPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Courses");
  const { user, getAuthHeaders } = useAuth();
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [courses, setCourses] = useState([]);

  const sections = ["Courses", "Users", "Instructors"];

  const { loadCourses, openAddCourseModal } = createCourseHandlers(setCourses);
  const { openAddUserModal } = createUserHandlers();
  const { goHome, handleLogout } = createNavigationHandlers(navigate);

  useEffect(() => {
    document.body.classList.add("admin-dashboard-bg");
    return () => document.body.classList.remove("admin-dashboard-bg");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light-theme", isLightTheme);
  }, [isLightTheme]);

  useEffect(() => {
    loadCourses();
  }, []);

  const openAddModal = () => {
    if (activeSection === "Courses") {
      openAddCourseModal();
    } else if (activeSection === "Users") {
      openAddUserModal();
    } else if (activeSection === "Instructors") {
      const event = new CustomEvent("openAddInstructorModal");
      window.dispatchEvent(event);
    }
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
                isMobile={false}
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
