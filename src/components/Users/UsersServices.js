/* eslint-disable */
import axios from "axios";

const API_BASE = "http://localhost:3000";

const getAuthHeaders = () => {
  const token =
    sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function loadUsers() {
  return axios
    .get("http://localhost:3000/users", { headers: getAuthHeaders() })
    .then((res) => {
      console.log("LoadUsers API Response:", res.data);
      // If res.data is an object with a "user" property, wrap it in an array
      if (res.data.user) {
        console.log("Single user found:", res.data.user);
        return [res.data.user];
      }
      // If res.data is already an array, return as is
      const users = Array.isArray(res.data) ? res.data : [];
      console.log("Users loaded:", users);
      return users;
    });
}

export function updateUser(userId, userData) {
  console.log("API Request - User ID:", userId);
  console.log("API Request - User ID type:", typeof userId);
  console.log("API Request - User Data:", userData);

  // Use the exact format that works in Postman
  const postmanPayload = { user: userData };
  console.log("API Request - Postman format:", postmanPayload);

  // Use the standard Rails RESTful route for updating users
  const url = `${API_BASE}/users/${userId}`;
  console.log("API Request - URL:", url);

  return axios
    .put(url, postmanPayload, { headers: getAuthHeaders() })
    .then((res) => {
      console.log("API Response (PUT /users/:id):", res.data);
      return res.data;
    })
    .catch((error) => {
      console.log(
        "PUT /users/:id failed:",
        error.response?.data || error.message
      );
      console.log("Error status:", error.response?.status);
      console.log("Error details:", error.response?.data);
      throw error;
    });
}

export function updateUserAlternative(userId, userData) {
  // This function is kept for backward compatibility but now just calls updateUser
  return updateUser(userId, userData);
}

export function deleteUser(userId) {
  return axios
    .delete(`${API_BASE}/users/${userId}`, { headers: getAuthHeaders() })
    .then((res) => res.data);
}

export function createUser(userData) {
  console.log("Creating user with data:", userData);

  // Set default role to 'user' since it's not in the form anymore
  const userDataWithRole = { ...userData, role: "user" };

  return axios
    .post(
      `${API_BASE}/create_user`,
      { user: userDataWithRole },
      { headers: getAuthHeaders() }
    )
    .then((res) => {
      console.log("User created successfully:", res.data);
      return res.data;
    })
    .catch((error) => {
      console.log(
        "Failed to create user:",
        error.response?.data || error.message
      );
      console.log("Error status:", error.response?.status);
      throw error;
    });
}
