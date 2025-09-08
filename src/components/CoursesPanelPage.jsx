/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadUsers } from "./Users/UsersServices";
import UsersTable from "./Users/UsersTable";
import AddUserForm from "./Users/AddUserForm";
import InstructorAddEditModal from "../modals/InstructorAddEditModal";
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../services/InstructorService";
import "./CoursesPanelPage.css";
import "../modals/modals.css";

const API_BASE = "http://localhost:3000";

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const emptyForm = {
  course_name: "",
  start_date: "",
  end_date: "",
  description: "",
  benefits: "",
  target_audience: "",
  additional_info: "",
  fee: "",
  max_students: "",
  enrolled_students: 0,
  course_status: "planned",
  rating: "",
  general_description: "",
};

// Helper function to generate unique IDs
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export default function CoursesPanelPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Courses");
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    avatar_url: "",
  });
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [editingInstructorId, setEditingInstructorId] = useState(null);
  const [isInstructorReadOnly, setIsInstructorReadOnly] = useState(false);
  const [instructorForm, setInstructorForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    course_ids: [],
    course_name: "",
    expertise: "",
    description: "",
  });
  const [showDeleteInstructorModal, setShowDeleteInstructorModal] =
    useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);

  const sections = ["Courses", "Users", "Instructors"];

  // --- Carousel state ---
  const [page, setPage] = useState(0);
  const [cols, setCols] = useState(1); // will be 2/3/4 per breakpoint
  const rows = 2;

  // AUTH HEADER GENERATOR
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // LOAD COURSES FROM API
  const loadCourses = useCallback(() => {
    axios
      .get(`${API_BASE}/courses`, { headers: getAuthHeaders() })
      .then((res) => setCourses(res.data))
      .catch(() => {});
  }, []);

  // DELETE CONFIRMATION STATE & HANDLERS
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCourse = async () => {
    try {
      await axios.delete(
        `${API_BASE}/courses/${courseToDelete.id}`,
        { headers: getAuthHeaders() },
      );
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
      loadCourses();
      setPage((p) => 0);
    } catch {
      alert('Failed to delete course.');
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

  // read user from JWT
  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) return;
    const payload = parseJwt(token);
    if (payload?.first_name) {
      setUser({
        first_name: payload.first_name,
        last_name: payload.last_name,
        avatar_url: payload.avatar_url || "",
      });
    }
  }, []);

  // load courses when section swaps
  useEffect(() => {
    if (activeSection === "Courses") loadCourses();
    if (activeSection === "Users") {
      loadUsers()
        .then(setUsers)
        .catch(() => setUsers([]));
    }
    if (activeSection === "Instructors") {
      getInstructors()
        .then(setInstructors)
        .catch(() => setInstructors([]));
    }
  }, [activeSection, loadCourses]);

  // responsive columns logic for carousel
  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth;
      if (w >= 1200) return 4;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    };
    const apply = () => {
      const newCols = computeCols();
      setCols((prev) => {
        if (prev !== newCols) {
          setPage(0);
        }
        return newCols;
      });
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  const pageSize = useMemo(() => cols * rows, [cols]);

  const totalPages = useMemo(() => {
    const total = Math.ceil((courses?.length || 0) / Math.max(1, pageSize)) || 1;
    return total;
  }, [courses, pageSize]);

  const currentItems = useMemo(() => {
    const start = page * pageSize;
    return courses.slice(start, start + pageSize);
  }, [courses, page, pageSize]);

  const goHome = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setInstructorForm((f) => ({ ...f, [name]: value }));
  };

  const openAddModal = () => {
    if (activeSection === "Users") {
      setShowAddUserModal(true);
    } else if (activeSection === "Instructors") {
      openInstructorAddModal();
    } else {
      setIsEditing(false);
      setEditingId(null);
      setForm(emptyForm);
      setReadOnly(false);
      setSelectedFile(null);
      setPreviewUrl("");
      setErrorMessage("");
      setShowModal(true);
    }
  };

  const openEditModal = (course) => {
    setIsEditing(true);
    setEditingId(course.id);
    setForm({
      course_name: course.course_name,
      start_date: course.start_date,
      end_date: course.end_date,
      description: course.description,
      benefits: course.benefits,
      target_audience: course.target_audience,
      additional_info: course.additional_info,
      fee: course.fee,
      max_students: course.max_students,
      enrolled_students: course.enrolled_students,
      course_status: course.course_status,
      rating: course.rating,
      general_description: course.general_description,
    });
    setReadOnly(true);
    setSelectedFile(null);
    setPreviewUrl("");
    setErrorMessage("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const payloadForm = {
      ...form,
      fee: parseFloat(form.fee) || 0,
      max_students: parseInt(form.max_students, 10) || 0,
      enrolled_students: form.enrolled_students,
      rating: form.rating !== "" ? parseFloat(form.rating) : null,
    };

    try {
      if (isEditing) {
        await axios.patch(
          `${API_BASE}/courses/${editingId}`,
          { course: payloadForm },
          { headers: getAuthHeaders() }
        );
      } else {
        const res = await axios.post(
          `${API_BASE}/courses`,
          { course: payloadForm },
          { headers: getAuthHeaders() }
        );
        setEditingId(res.data.course.id);
      }

      if (isEditing && selectedFile) {
        const data = new FormData();
        data.append('image', selectedFile);
        await axios.post(
          `${API_BASE}/courses/${editingId}/upload_image`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() } },
        );
      }

      setShowModal(false);
      setSelectedFile(null);
      setPreviewUrl('');
      loadCourses();
      setPage(0);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Failed to save course. Please check the console for details."
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !editingId) return;
    setErrorMessage("");
    const data = new FormData();
    data.append("image", selectedFile);
    try {
      await axios.post(`${API_BASE}/courses/${editingId}/upload_image`, data, {
        headers: { "Content-Type": "multipart/form-data", ...getAuthHeaders() },
      });
      setSelectedFile(null);
      setPreviewUrl("");
      loadCourses();
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Image upload failed. Please check the console for details."
      );
    }
  };

  const handleUserAdded = async () => {
    try {
      const updatedUsers = await loadUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  const handleInstructorSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (editingInstructorId) {
        await updateInstructor(
          editingInstructorId,
          instructorForm,
          selectedFile
        );
      } else {
        await createInstructor(instructorForm, selectedFile);
      }
      setShowInstructorModal(false);
      setEditingInstructorId(null);
      setInstructorForm({
        first_name: "",
        last_name: "",
        email: "",
        course_ids: [],
        course_name: "",
        expertise: "",
        description: "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
      getInstructors().then(setInstructors);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Failed to save instructor. Please check the console for details."
      );
    }
  };

  const openInstructorAddModal = () => {
    if (courses.length === 0) {
      loadCourses().then(() => {
        setIsInstructorReadOnly(false);
        setEditingInstructorId(null);
        setInstructorForm({
          first_name: "",
          last_name: "",
          email: "",
          course_ids: [],
          course_name: "",
          expertise: "",
          description: "",
        });
        setSelectedFile(null);
        setPreviewUrl("");
        setErrorMessage("");
        setShowInstructorModal(true);
      });
    } else {
      setIsInstructorReadOnly(false);
      setEditingInstructorId(null);
      setInstructorForm({
        first_name: "",
        last_name: "",
        email: "",
        course_ids: [],
        course_name: "",
        expertise: "",
        description: "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
      setErrorMessage("");
      setShowInstructorModal(true);
    }
  };

  const openInstructorEditModal = (instructor) => {
    if (courses.length === 0) {
      loadCourses().then(() => {
        setIsInstructorReadOnly(true);
        setEditingInstructorId(instructor.id);
        setInstructorForm({
          first_name: instructor.first_name || "",
          last_name: instructor.last_name || "",
          email: instructor.email || "",
          course_ids: instructor.course_ids || [],
          course_name: instructor.course_name || "",
          expertise: instructor.expertise || "",
          description: instructor.description || "",
        });
        setSelectedFile(null);
        setPreviewUrl("");
        setErrorMessage("");
        setShowInstructorModal(true);
      });
    } else {
      setIsInstructorReadOnly(true);
      setEditingInstructorId(instructor.id);
      setInstructorForm({
        first_name: instructor.first_name || "",
        last_name: instructor.last_name || "",
        email: instructor.email || "",
        course_ids: instructor.course_ids || [],
        course_name: instructor.course_name || "",
        expertise: instructor.expertise || "",
        description: instructor.description || "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
      setErrorMessage("");
      setShowInstructorModal(true);
    }
  };

  const handleInstructorEdit = () => {
    setIsInstructorReadOnly(false);
  };

  const handleInstructorDelete = async (instructor) => {
    setInstructorToDelete(instructor);
    setShowDeleteInstructorModal(true);
  };

  const confirmDeleteInstructor = async () => {
    if (!instructorToDelete) return;

    try {
      await deleteInstructor(instructorToDelete.id);
      getInstructors().then(setInstructors);
      setShowDeleteInstructorModal(false);
      setInstructorToDelete(null);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Failed to delete instructor. Please check the console for details."
      );
    }
  };

  const modalTitle = isEditing
    ? readOnly
      ? "Course Details"
      : "Edit Course"
    : "Add Course";

  // Carousel page jump handler
  const jumpTo = (idx) => setPage(idx);

  return (
    <div className="cpbp-dashboard-container">
      <header className="cpbp-dashboard-header">
        <div className="cpbp-header-left">
          <span className="cpbp-header-title">Admin Dashboard</span>
          <button
            type="button"
            className="cpbp-add-button"
            onClick={openAddModal}
          >
            {activeSection === "Instructors"
              ? "Add Instructor"
              : activeSection === "Users"
              ? "Add User"
              : "Add Course"}
          </button>
          <button
            type="button"
            className="cpbp-theme-button"
            onClick={() => setIsLightTheme((t) => !t)}
          >
            {isLightTheme ? "Dark Theme" : "Light Theme"}
          </button>
        </div>

        <div className="cpbp-header-right">
          <span className="cpbp-user-name">
            {user.first_name} {user.last_name}
          </span>
          <div className="cpbp-profile-pic-container">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                className="cpbp-profile-pic"
              />
            ) : (
              <span className="cpbp-user-icon">👤</span>
            )}
          </div>
        </div>
      </header>

      <div className="cpbp-dashboard-body">
        <div className="cpbp-panel nav-panel">
          <nav className="cpbp-dashboard-nav">
            <div className="cpbp-nav-top">
              {sections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  className={`cpbp-nav-button${
                    activeSection === sec ? " active" : ""
                  }`}
                  onClick={() => setActiveSection(sec)}
                >
                  {sec}
                </button>
              ))}
            </div>
            <div className="cpbp-nav-bottom">
              <button
                type="button"
                className="cpbp-nav-button"
                onClick={goHome}
              >
                Home
              </button>
              <button
                type="button"
                className="cpbp-nav-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </nav>
        </div>

        <div className="cpbp-panel content-panel">
          <main className="cpbp-dashboard-content">
            {activeSection === "Courses" ? (
              <div className="cpbp-cards-container">
                {currentItems.map((course) => (
                  <div key={course.id} className="cpbp-card">
                    <img
                      src={course.image_url || "/default-course.jpg"}
                      alt={course.course_name}
                      className="cpbp-card-image"
                    />
                    <h3 className="cpbp-card-title">{course.course_name}</h3>
                    <div className="cpbp-card-actions">
                      <button
                        type="button"
                        className="cpbp-btn-edit"
                        onClick={() => openEditModal(course)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="cpbp-btn-delete"
                        onClick={() => handleDeleteClick(course)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {/* Carousel navigation buttons */}
<button
  type="button"
  className="cpbp-carousel-btn cpbp-carousel-prev"
  onClick={() => setPage((p) => (p > 0 ? p - 1 : totalPages - 1))}
  aria-label="Previous"
>
  &#10094;
</button>

<button
  type="button"
  className="cpbp-carousel-btn cpbp-carousel-next"
  onClick={() => setPage((p) => (p < totalPages - 1 ? p + 1 : 0))}
  aria-label="Next"
>
  &#10095;
</button>

                {/* Carousel pagination for courses section */}
                {courses.length > pageSize && (
                  <div className="cpbp-page-indicator">
                    <span className="cpbp-page-label">
                      Page {Math.min(page + 1, totalPages)} of {totalPages}
                    </span>
                    <div className="cpbp-dots">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={`dot-${idx}`}
                          type="button"
                          className={`cpbp-dot${idx === page ? ' active' : ''}`}
                          onClick={() => jumpTo(idx)}
                          aria-label={`Go to page ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : activeSection === "Users" ? (
              <UsersTable users={users} onUserUpdate={setUsers} />
            ) : activeSection === "Instructors" ? (
              <div className="cpbp-cards-container">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="cpbp-card instructor-card"
                  >
                    <img
                      src={instructor.profile_pic_url || "/default-avatar.jpg"}
                      alt={`${instructor.first_name} ${instructor.last_name}`}
                      className="cpbp-card-image"
                    />
                    <h3 className="cpbp-card-title">{`${instructor.first_name} ${instructor.last_name}`}</h3>
                    <p className="cpbp-card-description">
                      {instructor.course_name || "No course assigned"}
                    </p>
                    <div className="cpbp-card-actions">
                      <button
                        type="button"
                        className="cpbp-btn-edit"
                        onClick={() => openInstructorEditModal(instructor)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="cpbp-btn-delete"
                        onClick={() => handleInstructorDelete(instructor)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="cpbp-placeholder">
                {activeSection} view not implemented yet.
              </p>
            )}
          </main>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="cpbp-modal-overlay">
          <div className="cpbp-modal-content">
            <button
              type="button"
              className="cpbp-modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 style={{ marginBottom: "1rem" }}>{modalTitle}</h2>
            {errorMessage && (
              <div className="cpbp-error-message">{errorMessage}</div>
            )}
            <form className="cpbp-form" onSubmit={handleSubmit}>
              <div className="cpbp-form-group">
                <label htmlFor="course_name">Course Name</label>
                <input
                  id="course_name"
                  name="course_name"
                  value={form.course_name}
                  onChange={handleChange}
                  required
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  id="end_date"
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="benefits">Benefits</label>
                <input
                  id="benefits"
                  name="benefits"
                  value={form.benefits}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="target_audience">Target Audience</label>
                <input
                  id="target_audience"
                  name="target_audience"
                  value={form.target_audience}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="additional_info">Additional Info</label>
                <input
                  id="additional_info"
                  name="additional_info"
                  value={form.additional_info}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="fee">Fee (€)</label>
                <input
                  id="fee"
                  type="number"
                  step="0.01"
                  name="fee"
                  value={form.fee}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="max_students">Max Students</label>
                <input
                  id="max_students"
                  type="number"
                  name="max_students"
                  value={form.max_students}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="course_status">Course Status</label>
                <select
                  id="course_status"
                  name="course_status"
                  value={form.course_status}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                >
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="rating">Rating</label>
                <input
                  id="rating"
                  type="number"
                  step="0.1"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                />
              </div>
              <div className="cpbp-form-group">
                <label htmlFor="general_description">General Description</label>
                <textarea
                  id="general_description"
                  name="general_description"
                  value={form.general_description}
                  onChange={handleChange}
                  disabled={isEditing && readOnly}
                />
              </div>
              {isEditing && (
                <div className="cpbp-form-group">
                  <label>Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={readOnly}
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        marginTop: "0.5rem",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <button
                    type="button"
                    className="cpbp-btn-submit"
                    onClick={handleImageUpload}
                    disabled={!selectedFile || readOnly}
                    style={{ marginTop: "0.5rem" }}
                  >
                    Upload Image
                  </button>
                </div>
              )}
              <div
                className="cpbp-form-buttons"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {isEditing && readOnly && (
                  <button
                    type="button"
                    className="cpbp-btn-edit"
                    onClick={() => setReadOnly(false)}
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  className="cpbp-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                {!isEditing && (
                  <button type="submit" className="cpbp-btn-submit">
                    Create
                  </button>
                )}
                {isEditing && !readOnly && (
                  <button type="submit" className="cpbp-btn-submit">
                    Save Changes
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <AddUserForm
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}

      {showInstructorModal && (
        <InstructorAddEditModal
          open={showInstructorModal}
          onClose={() => setShowInstructorModal(false)}
          instructorForm={instructorForm}
          isEditing={!!editingInstructorId}
          readOnly={isInstructorReadOnly}
          errorMessage={errorMessage}
          instructorPhotoPreview={previewUrl}
          handleInstructorChange={handleInstructorChange}
          handlePhotoChange={handleFileChange}
          handleSubmit={handleInstructorSubmit}
          handleEdit={handleInstructorEdit}
          courses={courses}
        />
      )}

      {showDeleteInstructorModal && instructorToDelete && (
        <div className="cpbp-modal-overlay">
          <div className="cpbp-delete-modal-container">
            <div className="cpbp-delete-modal-content">
              <div className="cpbp-delete-modal-header">
                <div className="cpbp-delete-icon-container">
                  <svg
                    className="cpbp-delete-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z" />
                  </svg>
                </div>
                <div className="cpbp-delete-modal-body">
                  <h3 className="cpbp-delete-title">Delete Instructor</h3>
                  <div className="cpbp-delete-message-container">
                    <p className="cpbp-delete-message">
                      Are you sure you want to delete instructor{" "}
                      <span className="cpbp-delete-item-name">
                        {instructorToDelete.first_name}{" "}
                        {instructorToDelete.last_name}
                      </span>
                      ? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="cpbp-delete-modal-actions">
              <button
                type="button"
                className="cpbp-btn-delete-confirm"
                onClick={confirmDeleteInstructor}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "1px solid #dc3545",
                }}
              >
                Confirm
              </button>
              <button
                type="button"
                className="cpbp-btn-cancel"
                onClick={() => {
                  setShowDeleteInstructorModal(false);
                  setInstructorToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="cpbp-modal-overlay">
          <div className="cpbp-modal-content">
            <h2>Are you sure you want to delete this course?</h2>
            <p><strong>{courseToDelete?.course_name}</strong></p>
            <div className="cpbp-form-buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="cpbp-btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                No
              </button>
              <button
                type="button"
                className="cpbp-btn-delete"
                onClick={confirmDeleteCourse}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}