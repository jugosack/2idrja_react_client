/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable */

import React from "react";

export default function InstructorForm({
  form,
  onChange,
  readOnly,
  isEditing,
  onCancel,
  onEdit,
  onSubmit,
  errorMessage,
  courses = [], // Add courses prop for dropdown
}) {
  console.log("Courses passed to InstructorForm:", courses);
  return (
    <>
      <div className="cpbp-form-group">
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          value={form.first_name || ""}
          onChange={onChange}
          disabled={readOnly}
          required
        />
      </div>

      <div className="cpbp-form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          value={form.last_name || ""}
          onChange={onChange}
          disabled={readOnly}
          required
        />
      </div>

      <div className="cpbp-form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email || ""}
          onChange={onChange}
          disabled={readOnly}
          required
        />
      </div>

      <div className="cpbp-form-group">
        <label>Course</label>
        <select
          name="course_ids"
          value={form.course_ids?.[0] || ""}
          onChange={(e) => {
            const courseId = parseInt(e.target.value);
            onChange({
              target: {
                name: "course_ids",
                value: courseId ? [courseId] : [],
              },
            });
          }}
          disabled={readOnly}
          required
          style={{ minHeight: "40px" }}
        >
          <option value="">Select a course...</option>
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No courses available
            </option>
          )}
        </select>
      </div>

      <div className="cpbp-form-group">
        <label>Expertise</label>
        <input
          type="text"
          name="expertise"
          value={form.expertise || ""}
          onChange={onChange}
          disabled={readOnly}
          placeholder="e.g., Frontend Development, JavaScript"
        />
      </div>

      <div className="cpbp-form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={onChange}
          disabled={readOnly}
          rows="4"
          placeholder="Brief description of the instructor's background and teaching style..."
        />
      </div>
    </>
  );
}
