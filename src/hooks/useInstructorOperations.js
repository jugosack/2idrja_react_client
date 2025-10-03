import { useState, useEffect } from 'react';
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../services/InstructorService';

const useInstructorOperations = (courses, loadCourses) => {
  const [instructors, setInstructors] = useState([]);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [editingInstructorId, setEditingInstructorId] = useState(null);
  const [isInstructorReadOnly, setIsInstructorReadOnly] = useState(false);
  const [instructorForm, setInstructorForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    course_ids: [],
    course_name: '',
    expertise: '',
    description: '',
  });
  const [showDeleteInstructorModal, setShowDeleteInstructorModal] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [currentInstructorIndex, setCurrentInstructorIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadInstructors = async () => {
    try {
      const instructorsData = await getInstructors();
      setInstructors(instructorsData);
    } catch (error) {
      console.error('Failed to load instructors:', error);
      setErrorMessage('Failed to load instructors');
    }
  };

  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setInstructorForm((f) => ({ ...f, [name]: value }));
  };

  const showPrevInstructor = () => {
    setCurrentInstructorIndex((idx) => (instructors.length
      ? (idx - 1 + instructors.length) % instructors.length
      : 0));
  };

  const showNextInstructor = () => {
    setCurrentInstructorIndex((idx) => (instructors.length ? (idx + 1) % instructors.length : 0));
  };

  const handleInstructorSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (editingInstructorId) {
        await updateInstructor(
          editingInstructorId,
          instructorForm,
          selectedFile,
        );
      } else {
        await createInstructor(instructorForm, selectedFile);
      }
      setShowInstructorModal(false);
      setEditingInstructorId(null);
      setInstructorForm({
        first_name: '',
        last_name: '',
        email: '',
        course_ids: [],
        course_name: '',
        expertise: '',
        description: '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
      getInstructors().then(setInstructors);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        'Failed to save instructor. Please check the console for details.',
      );
    }
  };

  const openInstructorAddModal = () => {
    if (courses.length === 0) {
      // Handle both Promise and non-Promise loadCourses
      const loadCoursesPromise = loadCourses();
      if (loadCoursesPromise && typeof loadCoursesPromise.then === 'function') {
        loadCoursesPromise.then(() => {
          setIsInstructorReadOnly(false);
          setEditingInstructorId(null);
          setInstructorForm({
            first_name: '',
            last_name: '',
            email: '',
            course_ids: [],
            course_name: '',
            expertise: '',
            description: '',
          });
          setSelectedFile(null);
          setPreviewUrl('');
          setErrorMessage('');
          setShowInstructorModal(true);
        });
      } else {
        // If loadCourses doesn't return a Promise, just proceed
        setIsInstructorReadOnly(false);
        setEditingInstructorId(null);
        setInstructorForm({
          first_name: '',
          last_name: '',
          email: '',
          course_ids: [],
          course_name: '',
          expertise: '',
          description: '',
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setErrorMessage('');
        setShowInstructorModal(true);
      }
    } else {
      setIsInstructorReadOnly(false);
      setEditingInstructorId(null);
      setInstructorForm({
        first_name: '',
        last_name: '',
        email: '',
        course_ids: [],
        course_name: '',
        expertise: '',
        description: '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
      setErrorMessage('');
      setShowInstructorModal(true);
    }
  };

  const openInstructorEditModal = (instructor) => {
    if (courses.length === 0) {
      loadCourses().then(() => {
        setIsInstructorReadOnly(true);
        setEditingInstructorId(instructor.id);
        setInstructorForm({
          first_name: instructor.first_name || '',
          last_name: instructor.last_name || '',
          email: instructor.email || '',
          course_ids: instructor.course_ids || [],
          course_name: instructor.course_name || '',
          expertise: instructor.expertise || '',
          description: instructor.description || '',
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setErrorMessage('');
        setShowInstructorModal(true);
      });
    } else {
      setIsInstructorReadOnly(true);
      setEditingInstructorId(instructor.id);
      setInstructorForm({
        first_name: instructor.first_name || '',
        last_name: instructor.last_name || '',
        email: instructor.email || '',
        course_ids: instructor.course_ids || [],
        course_name: instructor.course_name || '',
        expertise: instructor.expertise || '',
        description: instructor.description || '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
      setErrorMessage('');
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
        'Failed to delete instructor. Please check the console for details.',
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Ensure current instructor index stays in range
  // Load instructors on mount
  useEffect(() => {
    loadInstructors();
  }, []);

  useEffect(() => {
    if (currentInstructorIndex >= instructors.length) {
      setCurrentInstructorIndex(0);
    }
  }, [instructors, currentInstructorIndex]);

  return {
    // State
    instructors,
    showInstructorModal,
    editingInstructorId,
    isInstructorReadOnly,
    instructorForm,
    showDeleteInstructorModal,
    instructorToDelete,
    currentInstructorIndex,
    selectedFile,
    previewUrl,
    errorMessage,
    // Actions
    setInstructors,
    setShowInstructorModal,
    setEditingInstructorId,
    setIsInstructorReadOnly,
    setShowDeleteInstructorModal,
    setInstructorToDelete,
    setCurrentInstructorIndex,
    handleInstructorChange,
    showPrevInstructor,
    showNextInstructor,
    handleInstructorSubmit,
    openInstructorAddModal,
    openInstructorEditModal,
    handleInstructorEdit,
    handleInstructorDelete,
    confirmDeleteInstructor,
    handleFileChange,
    loadInstructors,
  };
};

export default useInstructorOperations;
