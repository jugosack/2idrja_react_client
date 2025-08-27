/* eslint-disable jsx-a11y/label-has-associated-control, no-unused-vars, no-nested-ternary */
/* eslint-disable */

import axios from "axios";
const API_BASE = "http://localhost:3000";

export function getAuthHeaders() {
  const token = sessionStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getInstructors() {
  try {
    const res = await axios.get(`${API_BASE}/instructors`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("auth_token");
      window.location.href = "/login";
      return [];
    }
    throw error;
  }
}

export async function createInstructor(data, file) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "course_ids" && Array.isArray(value)) {
      // Handle course_ids array - append each course_id separately
      value.forEach((courseId) => {
        formData.append("course_ids[]", courseId);
      });
    } else {
      formData.append(key, value);
    }
  });
  if (file) formData.append("profile_pic", file);

  const res = await axios.post(`${API_BASE}/instructors`, formData, {
    headers: { "Content-Type": "multipart/form-data", ...getAuthHeaders() },
  });
  return res.data;
}

export async function updateInstructor(id, data, file) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "course_ids" && Array.isArray(value)) {
      // Handle course_ids array - append each course_id separately
      value.forEach((courseId) => {
        formData.append("course_ids[]", courseId);
      });
    } else {
      formData.append(key, value);
    }
  });
  if (file) formData.append("profile_pic", file);

  const res = await axios.put(`${API_BASE}/instructors/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data", ...getAuthHeaders() },
  });
  return res.data;
}

export async function deleteInstructor(id) {
  return axios.delete(`${API_BASE}/instructors/${id}`, {
    headers: getAuthHeaders(),
  });
}
