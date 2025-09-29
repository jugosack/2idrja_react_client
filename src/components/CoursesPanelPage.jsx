/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardNavigation from "./DashboardNavigation";
import CourseManagement from "./CourseManagement";
import InstructorManagement from "./InstructorManagement";
import UserManagement from "./UserManagement";
import InstructorAddEditModal from "../modals/InstructorAddEditModal";
import DeleteModal from "../modals/DeleteModal";
import { useAuth, useResponsive } from "../hooks";
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../services/InstructorService";
import { getCourses } from "../services/CourseService";
import "./CoursesPanelPage.css";
import "../modals/modals.css";

export default function CoursesPanelPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Courses");
  const { user, getAuthHeaders } = useAuth();
  const { isMobile } = useResponsive();
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [courses, setCourses] = useState([]);

  // Instructor management state
  const [instructors, setInstructors] = useState([]);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showDeleteInstructorModal, setShowDeleteInstructorModal] =
    useState(false);
  const [editingInstructorId, setEditingInstructorId] = useState(null);
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [isInstructorReadOnly, setIsInstructorReadOnly] = useState(false);
  const [instructorForm, setInstructorForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    course_name: "",
    expertise: "",
    description: "",
  });
  const [instructorPhotoFile, setInstructorPhotoFile] = useState(null);
  const [instructorPhotoPreview, setInstructorPhotoPreview] = useState(null);
  const [instructorErrorMessage, setInstructorErrorMessage] = useState("");

  const sections = ["Courses", "Users", "Instructors"];

  // Refs to access management component functions
  const courseManagementRef = useRef(null);
  const instructorManagementRef = useRef(null);
  const userManagementRef = useRef(null);

  // Load courses function
  const loadCourses = async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  // Load instructors function
  const loadInstructors = async () => {
    try {
      const instructorsData = await getInstructors();
      setInstructors(instructorsData);
    } catch (error) {
      console.error("Failed to load instructors:", error);
      setInstructorErrorMessage("Failed to load instructors");
    }
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

  // Load data on component mount
  useEffect(() => {
    loadCourses();
    loadInstructors();
  }, []);

  // Load instructors when switching to instructors section
  useEffect(() => {
    if (activeSection === "Instructors") {
      loadInstructors();
    }
  }, [activeSection]);

  const goHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    navigate("/login");
  };

  // Instructor form handlers
  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setInstructorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstructorPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInstructorPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setInstructorPhotoPreview(previewUrl);
    }
  };

  const resetInstructorForm = () => {
    setInstructorForm({
      first_name: "",
      last_name: "",
      email: "",
      course_name: "",
      expertise: "",
      description: "",
    });
    setInstructorPhotoFile(null);
    setInstructorPhotoPreview(null);
    setInstructorErrorMessage("");
    setEditingInstructorId(null);
    setIsInstructorReadOnly(false);
  };

  const openAddInstructorModal = () => {
    resetInstructorForm();
    setShowInstructorModal(true);
  };

  const openEditInstructorModal = (instructor) => {
    setInstructorForm({
      first_name: instructor.first_name || "",
      last_name: instructor.last_name || "",
      email: instructor.email || "",
      course_name: instructor.course_name || "",
      expertise: instructor.expertise || "",
      description: instructor.description || "",
    });
    setInstructorPhotoPreview(instructor.profile_pic_url || null);
    setEditingInstructorId(instructor.id);
    setIsInstructorReadOnly(false);
    setShowInstructorModal(true);
  };

  const openViewInstructorModal = (instructor) => {
    setInstructorForm({
      first_name: instructor.first_name || "",
      last_name: instructor.last_name || "",
      email: instructor.email || "",
      course_name: instructor.course_name || "",
      expertise: instructor.expertise || "",
      description: instructor.description || "",
    });
    setInstructorPhotoPreview(instructor.profile_pic_url || null);
    setEditingInstructorId(instructor.id);
    setIsInstructorReadOnly(true);
    setShowInstructorModal(true);
  };

  const handleEditFromView = () => {
    setIsInstructorReadOnly(false);
  };

  const handleInstructorSubmit = async (e) => {
    e.preventDefault();
    setInstructorErrorMessage("");

    try {
      if (editingInstructorId) {
        // Update existing instructor
        await updateInstructor(
          editingInstructorId,
          instructorForm,
          instructorPhotoFile
        );
      } else {
        // Create new instructor
        await createInstructor(instructorForm, instructorPhotoFile);
      }

      setShowInstructorModal(false);
      resetInstructorForm();
      loadInstructors(); // Refresh the list
    } catch (error) {
      console.error("Failed to save instructor:", error);
      setInstructorErrorMessage(
        error.response?.data?.message || "Failed to save instructor"
      );
    }
  };

  const handleDeleteInstructor = (instructor) => {
    setInstructorToDelete(instructor);
    setShowDeleteInstructorModal(true);
  };

  const confirmDeleteInstructor = async () => {
    if (!instructorToDelete) return;

    try {
      await deleteInstructor(instructorToDelete.id);
      setShowDeleteInstructorModal(false);
      setInstructorToDelete(null);
      loadInstructors(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete instructor:", error);
      setInstructorErrorMessage("Failed to delete instructor");
    }
  };

  const openAddModal = () => {
    if (activeSection === "Courses") {
      // Trigger course modal opening
      const event = new CustomEvent("openAddCourseModal");
      window.dispatchEvent(event);
    } else if (activeSection === "Users") {
      // Trigger user modal opening
      const event = new CustomEvent("openAddUserModal");
      window.dispatchEvent(event);
    } else if (activeSection === "Instructors") {
      openAddInstructorModal();
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
              <div>
                {instructorErrorMessage && (
                  <div className="cpbp-error-message">
                    {instructorErrorMessage}
                  </div>
                )}

                <div className="cpbp-cards-container">
                  {instructors.length > 0 ? (
                    instructors.map((instructor) => (
                      <div key={instructor.id} className="cpbp-card">
                        {instructor.profile_pic_url ? (
                          <img
                            src={instructor.profile_pic_url}
                            alt={`${instructor.first_name} ${instructor.last_name}`}
                            className="cpbp-instructor-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="cpbp-instructor-placeholder"
                          style={{
                            display: instructor.profile_pic_url
                              ? "none"
                              : "flex",
                          }}
                        >
                          {instructor.first_name?.[0]}
                          {instructor.last_name?.[0]}
                        </div>
                        <h3 className="cpbp-card-title">
                          {instructor.first_name} {instructor.last_name}
                        </h3>
                        <p className="cpbp-instructor-course">
                          {instructor.course_name}
                        </p>
                        <div className="cpbp-card-actions">
                          <button
                            className="cpbp-btn-edit"
                            onClick={() => openViewInstructorModal(instructor)}
                          >
                            Details
                          </button>
                          <button
                            className="cpbp-btn-delete"
                            onClick={() => handleDeleteInstructor(instructor)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="cpbp-no-instructors">
                      <p>
                        No instructors found. Click "Add" to create your first
                        instructor.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="cpbp-placeholder">
                {activeSection} view not implemented yet.
              </p>
            )}
          </main>
        </div>
      </div>

      {/* Instructor Add/Edit Modal */}
      <InstructorAddEditModal
        open={showInstructorModal}
        onClose={() => {
          setShowInstructorModal(false);
          resetInstructorForm();
        }}
        instructorForm={instructorForm}
        isEditing={!!editingInstructorId}
        readOnly={isInstructorReadOnly}
        errorMessage={instructorErrorMessage}
        instructorPhotoPreview={instructorPhotoPreview}
        handleInstructorChange={handleInstructorChange}
        handlePhotoChange={handleInstructorPhotoChange}
        handleSubmit={handleInstructorSubmit}
        handleEdit={handleEditFromView}
        courses={courses}
      />

      {/* Delete Instructor Modal */}
      <DeleteModal
        open={showDeleteInstructorModal}
        onClose={() => {
          setShowDeleteInstructorModal(false);
          setInstructorToDelete(null);
        }}
        onConfirm={confirmDeleteInstructor}
        itemType="Instructor"
        itemName={
          instructorToDelete
            ? `${instructorToDelete.first_name} ${instructorToDelete.last_name}`
            : ""
        }
      />
    </div>
  );
}
