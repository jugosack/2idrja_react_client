import { getCourses } from '../services/CourseService';

// Course handlers for CoursesPanelPage
export const createCourseHandlers = (setCourses) => {
  const loadCourses = async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const openAddCourseModal = () => {
    // Trigger course modal opening via custom event
    const event = new CustomEvent('openAddCourseModal');
    window.dispatchEvent(event);
  };

  return {
    loadCourses,
    openAddCourseModal,
  };
};

export default createCourseHandlers;
