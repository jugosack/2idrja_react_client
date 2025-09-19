import axios from 'axios';

const API_BASE = 'http://localhost:3000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Load all courses
export const loadCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE}/courses`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error loading courses:', error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const payloadForm = {
      ...courseData,
      fee: parseFloat(courseData.fee) || 0,
      max_students: parseInt(courseData.max_students, 10) || 0,
      enrolled_students: courseData.enrolled_students,
      rating: courseData.rating !== '' ? parseFloat(courseData.rating) : null,
    };

    const response = await axios.post(
      `${API_BASE}/courses`,
      { course: payloadForm },
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (courseId, courseData) => {
  try {
    const payloadForm = {
      ...courseData,
      fee: parseFloat(courseData.fee) || 0,
      max_students: parseInt(courseData.max_students, 10) || 0,
      enrolled_students: courseData.enrolled_students,
      rating: courseData.rating !== '' ? parseFloat(courseData.rating) : null,
    };

    const response = await axios.patch(
      `${API_BASE}/courses/${courseId}`,
      { course: payloadForm },
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    const response = await axios.delete(
      `${API_BASE}/courses/${courseId}`,
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Upload course image
export const uploadCourseImage = async (courseId, imageFile) => {
  try {
    const data = new FormData();
    data.append('image', imageFile);

    const response = await axios.post(
      `${API_BASE}/courses/${courseId}/upload_image`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading course image:', error);
    throw error;
  }
};

// Update course image
export const updateCourseImage = async (courseId, imageFile) => {
  try {
    const data = new FormData();
    data.append('image', imageFile);

    const response = await axios.patch(
      `${API_BASE}/courses/${courseId}/upload_image`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating course image:', error);
    throw error;
  }
};

// Empty form template
export const emptyCourseForm = {
  course_name: '',
  start_date: '',
  end_date: '',
  description: '',
  benefits: '',
  target_audience: '',
  additional_info: '',
  fee: '',
  max_students: '',
  enrolled_students: 0,
  course_status: 'planned',
  rating: '',
  general_description: '',
};
