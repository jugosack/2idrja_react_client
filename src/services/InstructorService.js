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
      try {
        localStorage.removeItem("auth_token");
      } catch (_) {}
      window.location.href = "/login";
      return [];
    }
    throw error;
  }
}

export async function createInstructor(data, file) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "course_name") {
      formData.append("course_name", value);
    } else if (key !== "course_ids") {
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
    if (key === "course_name") {
      formData.append("course_name", value);
    } else if (key !== "course_ids") {
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
