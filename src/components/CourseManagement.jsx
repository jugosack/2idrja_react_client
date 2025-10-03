import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CoursesGrid from './CoursesGrid';
import CourseModal from './CourseModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useCarousel } from '../hooks';
import useCourseOperations from '../hooks/useCourseOperations';

const CourseManagement = ({
  getAuthHeaders,
  setPage,
}) => {
  const {
    courses,
    showModal,
    isEditing,
    readOnly,
    form,
    errorMessage,
    selectedFile,
    previewUrl,
    showDeleteConfirm,
    courseToDelete,
    setShowModal,
    setReadOnly,
    setShowDeleteConfirm,
    handleDeleteClick,
    confirmDeleteCourse,
    handleChange,
    handleMaxStudentsChange,
    openAddModal,
    openEditModal,
    handleSubmit,
    handleFileChange,
    handleImageUpload,
  } = useCourseOperations(getAuthHeaders, () => {}, setPage);

  const {
    page,
    pageSize,
    totalPages,
    currentItems,
    jumpTo,
    goToPrevious,
    goToNext,
  } = useCarousel(courses);

  const modalTitle = (() => {
    if (isEditing) {
      return readOnly ? 'Course Details' : 'Edit Course';
    }
    return 'Add Course';
  })();

  // Listen for custom events to open modals
  useEffect(() => {
    const handleOpenAddCourseModal = () => {
      openAddModal();
    };

    window.addEventListener('openAddCourseModal', handleOpenAddCourseModal);
    return () => window.removeEventListener('openAddCourseModal', handleOpenAddCourseModal);
  }, [openAddModal]);

  return (
    <>
      <CoursesGrid
        currentItems={currentItems}
        openEditModal={openEditModal}
        handleDeleteClick={handleDeleteClick}
        page={page}
        totalPages={totalPages}
        courses={courses}
        pageSize={pageSize}
        jumpTo={jumpTo}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
      />

      <CourseModal
        showModal={showModal}
        setShowModal={setShowModal}
        isEditing={isEditing}
        readOnly={readOnly}
        setReadOnly={setReadOnly}
        modalTitle={modalTitle}
        form={form}
        handleChange={handleChange}
        handleMaxStudentsChange={handleMaxStudentsChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        handleImageUpload={handleImageUpload}
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        errorMessage={errorMessage}
      />

      <DeleteConfirmationModal
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        courseToDelete={courseToDelete}
        confirmDeleteCourse={confirmDeleteCourse}
      />
    </>
  );
};

CourseManagement.propTypes = {
  getAuthHeaders: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default CourseManagement;
