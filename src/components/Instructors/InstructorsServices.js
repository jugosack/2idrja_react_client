import {
  getInstructors, createInstructor, updateInstructor, deleteInstructor,
} from '../../services/InstructorService';

// Re-export instructor services for consistency
export {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
};

// Empty instructor form template
export const emptyInstructorForm = {
  first_name: '',
  last_name: '',
  email: '',
  course_ids: [],
  course_name: '',
  expertise: '',
  description: '',
};
