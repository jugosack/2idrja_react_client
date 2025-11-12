import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const emptyForm = {
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

const useCourseOperations = (getAuthHeaders, loadCourses, setPage) => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const loadCoursesData = useCallback(() => {
    axios
      .get(`${API_BASE}/courses`, { headers: getAuthHeaders() })
      .then((res) => setCourses(res.data))
      .catch(() => {});
  }, [getAuthHeaders]);

  // Load courses when component mounts
  useEffect(() => {
    loadCoursesData();
  }, [loadCoursesData]);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCourse = async () => {
    try {
      await axios.delete(`${API_BASE}/courses/${courseToDelete.id}`, {
        headers: getAuthHeaders(),
      });
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
      loadCoursesData();
      setPage(0);
    } catch (error) {
      const errorMessage = error.response?.data?.error
                          || error.response?.data?.errors?.join(', ')
                          || error.message
                          || 'Failed to delete course.';
      alert(`Failed to delete course: ${errorMessage}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleMaxStudentsChange = (e) => {
    let { value } = e.target;
    if (value === '') {
      setForm((f) => ({ ...f, max_students: '' }));
      return;
    }
    value = value.replace(/[^0-9]/g, '');
    if (value === '') {
      setForm((f) => ({ ...f, max_students: '' }));
      return;
    }
    const clamped = Math.max(0, Math.min(1000, parseInt(value, 10)));
    setForm((f) => ({ ...f, max_students: clamped }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm(emptyForm);
    setReadOnly(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setErrorMessage('');
    setShowModal(true);
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
    setPreviewUrl('');
    setErrorMessage('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Fix course_status: map 'active' to 'ongoing' to match backend enum
    let courseStatus = form.course_status;
    if (courseStatus === 'active') {
      courseStatus = 'ongoing';
    }

    const payloadForm = {
      ...form,
      course_status: courseStatus,
      fee: form.fee !== '' ? parseFloat(form.fee) || 0 : 0,
      max_students: form.max_students !== '' ? parseInt(form.max_students, 10) : null,
      enrolled_students: form.enrolled_students !== undefined ? parseInt(form.enrolled_students, 10) || 0 : 0,
      rating: form.rating !== '' && form.rating !== null ? parseFloat(form.rating) : null,
    };

    console.log('useCourseOperations - Sending course data:', { course: payloadForm });

    try {
      if (isEditing) {
        await axios.patch(
          `${API_BASE}/courses/${editingId}`,
          { course: payloadForm },
          { headers: getAuthHeaders() },
        );
      } else {
        const res = await axios.post(
          `${API_BASE}/courses`,
          { course: payloadForm },
          { headers: getAuthHeaders() },
        );
        setEditingId(res.data.course.id);
      }

      if (isEditing && selectedFile) {
        const data = new FormData();
        data.append('image', selectedFile);
        await axios.patch(
          `${API_BASE}/courses/${editingId}/upload_image`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              ...getAuthHeaders(),
            },
          },
        );
      }

      setShowModal(false);
      setSelectedFile(null);
      setPreviewUrl('');
      loadCoursesData();
      setPage(0);
    } catch (err) {
      console.error('useCourseOperations error:', err);
      console.error('Error response:', err.response?.data);
      let errorMsg = 'Failed to save course.';
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          errorMsg = Array.isArray(err.response.data.errors)
            ? err.response.data.errors.join(', ')
            : err.response.data.errors;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        }
      }
      setErrorMessage(errorMsg);
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
    setErrorMessage('');
    const data = new FormData();
    data.append('image', selectedFile);
    try {
      await axios.patch(`${API_BASE}/courses/${editingId}/upload_image`, data, {
        headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
      });
      setSelectedFile(null);
      setPreviewUrl('');
      loadCoursesData();
    } catch (err) {
      console.error('Image upload error:', err);
      console.error('Error response:', err.response?.data);
      setErrorMessage(
        'Image upload failed. Please check the console for details.',
      );
    }
  };

  return {
    // State
    courses,
    showModal,
    isEditing,
    editingId,
    readOnly,
    form,
    errorMessage,
    selectedFile,
    previewUrl,
    showDeleteConfirm,
    courseToDelete,
    // Actions
    loadCourses: loadCoursesData,
    setShowModal,
    setIsEditing,
    setReadOnly,
    setShowDeleteConfirm,
    setCourseToDelete,
    handleDeleteClick,
    confirmDeleteCourse,
    handleChange,
    handleMaxStudentsChange,
    openAddModal,
    openEditModal,
    handleSubmit,
    handleFileChange,
    handleImageUpload,
  };
};

export default useCourseOperations;
