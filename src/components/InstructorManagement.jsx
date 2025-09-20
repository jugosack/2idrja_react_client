import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import InstructorsSection from './InstructorsSection';
import InstructorAddEditModal from '../modals/InstructorAddEditModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import useInstructorOperations from '../hooks/useInstructorOperations';

const InstructorManagement = ({
  courses,
  loadCourses,
  isMobile,
}) => {
  const {
    instructors,
    showInstructorModal,
    editingInstructorId,
    isInstructorReadOnly,
    instructorForm,
    showDeleteInstructorModal,
    instructorToDelete,
    currentInstructorIndex,
    previewUrl,
    errorMessage,
    setShowInstructorModal,
    setEditingInstructorId,
    setIsInstructorReadOnly,
    setShowDeleteInstructorModal,
    setInstructorToDelete,
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
  } = useInstructorOperations(courses, loadCourses);

  // Listen for custom events to open modals
  useEffect(() => {
    const handleOpenAddInstructorModal = () => {
      console.log('Opening add instructor modal, editingInstructorId:', editingInstructorId);
      // Ensure we're in "add" mode, not "edit" mode
      setEditingInstructorId(null);
      setIsInstructorReadOnly(false);
      openInstructorAddModal();
    };

    window.addEventListener('openAddInstructorModal', handleOpenAddInstructorModal);
    return () => window.removeEventListener('openAddInstructorModal', handleOpenAddInstructorModal);
  }, [openInstructorAddModal, editingInstructorId]);

  return (
    <>
      <InstructorsSection
        instructors={instructors}
        isMobile={isMobile}
        openInstructorEditModal={openInstructorEditModal}
        handleInstructorDelete={handleInstructorDelete}
        showPrevInstructor={showPrevInstructor}
        showNextInstructor={showNextInstructor}
        currentInstructorIndex={currentInstructorIndex}
      />

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
      {/* Debug info */}
      {console.log(
        'InstructorManagement render - editingInstructorId:',
        editingInstructorId,
        'isEditing:',
        !!editingInstructorId,
      )}

      <DeleteConfirmationModal
        isInstructor
        instructorToDelete={instructorToDelete}
        setInstructorToDelete={setInstructorToDelete}
        confirmDeleteInstructor={confirmDeleteInstructor}
        showDeleteInstructorModal={showDeleteInstructorModal}
        setShowDeleteInstructorModal={setShowDeleteInstructorModal}
        showDeleteConfirm={false}
        setShowDeleteConfirm={() => {}}
        courseToDelete={null}
        confirmDeleteCourse={() => {}}
      />
    </>
  );
};

InstructorManagement.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    course_name: PropTypes.string.isRequired,
  })).isRequired,
  loadCourses: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default InstructorManagement;
