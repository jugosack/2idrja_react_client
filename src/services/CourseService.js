/* eslint-disable */

import axios from "axios";
const API_BASE = "http://localhost:3000";

export function getAuthHeaders() {
  // Support both legacy "token" and current "auth_token" keys
  const token =
      sessionStorage.getItem("auth_token") ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCourses() {
  try {
    const res = await axios.get(`${API_BASE}/courses`, {
      headers: getAuthHeaders(),
    });
    const data = res.data?.courses ?? res.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("auth_token");
      try {
        localStorage.removeItem("auth_token");
      } catch (_) {}
      window.location.href = "/login";
      return [];
    }
    console.error("Failed to fetch courses:", error);
    throw error;
  }
}

export async function getCourseById(id) {
  try {
    const res = await axios.get(`${API_BASE}/courses/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = res.data?.course ?? res.data;
    return data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("auth_token");
      try {
        localStorage.removeItem("auth_token");
      } catch (_) {}
      window.location.href = "/login";
      return null;
    }
    console.error(`Failed to fetch course with id ${id}:`, error);
    throw error;
  }
}

export async function createCourse(course) {
  const payload = { course };
  try {
    const res = await axios.post(`${API_BASE}/courses`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("auth_token");
      try {
        localStorage.removeItem("auth_token");
      } catch (_) {}
      window.location.href = "/login";
      return null;
    }
    throw error;
  }
}

export async function updateCourse(id, course) {
  const payload = { course };
  try {
    const res = await axios.patch(`${API_BASE}/courses/${id}`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("auth_token");
      try {
        localStorage.removeItem("auth_token");
      } catch (_) {}
      window.location.href = "/login";
      return null;
    }
    throw error;
  }
}

export async function deleteCourse(id) {
  try {
    const res = await axios.delete(`${API_BASE}/courses/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("auth_token");
      try {
        localStorage.removeItem("auth_token");
      } catch (_) {}
      window.location.href = "/login";
      return null;
    }
    throw error;
  }
}

export async function uploadCourseImage(id, file) {
  const data = new FormData();
  data.append("image", file);
  try {
    const res = await axios.post(
        `${API_BASE}/courses/${id}/upload_image`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data", ...getAuthHeaders() },
        }
    );
    return res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("auth_token");
      try {
        localStorage.removeItem("auth_token");
      } catch (_) {}
      window.location.href = "/login";
      return null;
    }
    throw error;
  }
}

export async function getCourseByName(courseName) {
  try {
    const courses = await getCourses();
    return courses.find((course) =>
        course.course_name.toLowerCase().includes(courseName.toLowerCase())
    );
  } catch (error) {
    console.error(`Failed to find course with name ${courseName}:`, error);
    return null;
  }
}

export async function getInstructorsForCourse(courseId) {
  try {
    const { getInstructors } = await import("./InstructorService");
    const [instructors, course] = await Promise.all([
      getInstructors(),
      getCourseById(courseId),
    ]);

    if (!course) return [];

    const targetName = (course.course_name || "").toLowerCase();
    return instructors.filter((instructor) => {
      const instructorCourse = (instructor.course_name || "").toLowerCase();
      return instructorCourse === targetName;
    });
  } catch (error) {
    console.error(`Failed to fetch instructors for course ${courseId}:`, error);
    return [];
  }
}