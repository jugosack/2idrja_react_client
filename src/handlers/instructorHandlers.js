import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../services/InstructorService';

// Instructor form handlers
const createInstructorHandlers = (
  setInstructors,
  setShowInstructorModal,
  setEditingInstructorId,
  setIsInstructorReadOnly,
  setInstructorForm,
  setInstructorPhotoFile,
  setInstructorPhotoPreview,
  setInstructorErrorMessage,
  setShowDeleteInstructorModal,
  setInstructorToDelete,
) => {
  const loadInstructors = async () => {
    try {
      const instructorsData = await getInstructors();
      setInstructors(instructorsData);
    } catch (error) {
      console.error('Failed to load instructors:', error);
      setInstructorErrorMessage('Failed to load instructors');
    }
  };

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
      first_name: '',
      last_name: '',
      email: '',
      course_name: '',
      expertise: '',
      description: '',
    });
    setInstructorPhotoFile(null);
    setInstructorPhotoPreview(null);
    setInstructorErrorMessage('');
    setEditingInstructorId(null);
    setIsInstructorReadOnly(false);
  };

  const openAddInstructorModal = () => {
    resetInstructorForm();
    setShowInstructorModal(true);
  };

  const openEditInstructorModal = (instructor) => {
    setInstructorForm({
      first_name: instructor.first_name || '',
      last_name: instructor.last_name || '',
      email: instructor.email || '',
      course_name: instructor.course_name || '',
      expertise: instructor.expertise || '',
      description: instructor.description || '',
    });
    setInstructorPhotoPreview(instructor.profile_pic_url || null);
    setEditingInstructorId(instructor.id);
    setIsInstructorReadOnly(false);
    setShowInstructorModal(true);
  };

  const openViewInstructorModal = (instructor) => {
    setInstructorForm({
      first_name: instructor.first_name || '',
      last_name: instructor.last_name || '',
      email: instructor.email || '',
      course_name: instructor.course_name || '',
      expertise: instructor.expertise || '',
      description: instructor.description || '',
    });
    setInstructorPhotoPreview(instructor.profile_pic_url || null);
    setEditingInstructorId(instructor.id);
    setIsInstructorReadOnly(true);
    setShowInstructorModal(true);
  };

  const handleEditFromView = () => {
    setIsInstructorReadOnly(false);
  };

  const handleInstructorSubmit = async (
    e,
    instructorForm,
    instructorPhotoFile,
    editingInstructorId,
  ) => {
    e.preventDefault();
    setInstructorErrorMessage('');

    try {
      if (editingInstructorId) {
        await updateInstructor(
          editingInstructorId,
          instructorForm,
          instructorPhotoFile,
        );
      } else {
        // Create new instructor
        await createInstructor(instructorForm, instructorPhotoFile);
      }

      setShowInstructorModal(false);
      resetInstructorForm();
      loadInstructors(); // Refresh the list
    } catch (error) {
      console.error('Failed to save instructor:', error);
      setInstructorErrorMessage(
        error.response?.data?.message || 'Failed to save instructor',
      );
    }
  };

  const handleDeleteInstructor = (instructor) => {
    setInstructorToDelete(instructor);
    setShowDeleteInstructorModal(true);
  };

  const confirmDeleteInstructor = async (instructorToDelete) => {
    if (!instructorToDelete) return;

    try {
      await deleteInstructor(instructorToDelete.id);
      setShowDeleteInstructorModal(false);
      setInstructorToDelete(null);
      loadInstructors(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete instructor:', error);
      setInstructorErrorMessage('Failed to delete instructor');
    }
  };

  return {
    loadInstructors,
    handleInstructorChange,
    handleInstructorPhotoChange,
    resetInstructorForm,
    openAddInstructorModal,
    openEditInstructorModal,
    openViewInstructorModal,
    handleEditFromView,
    handleInstructorSubmit,
    handleDeleteInstructor,
    confirmDeleteInstructor,
  };
};

export default createInstructorHandlers;
