import React, { useState } from 'react';
import './CoursesPanelPage.css';

const initialCourses = [
  {
    id: 1,
    courseName: 'HTML course',
    startDate: '01/01/2025',
    endDate: '01/01/2026',
    image: 'https://via.placeholder.com/40',
    description: 'basics of HTML',
    benefits: 'many',
    targetAudience: 'newbs',
    additionalInfo: 'HTML course',
    fee: '$1 mil',
    maxStudents: 20,
    enrolledStudents: 3,
    placesLeft: 'auto calc',
    status: 'ongoing',
    rating: '10/10',
  },
];

const initialUsers = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '123456789',
    country: 'USA',
    email: 'jane@example.com',
    createdAt: '2023-01-01',
    updatedAt: '2024-01-01',
  },
];

const initialInstructors = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    courseName: 'CSS course',
    description: 'Advanced CSS topics',
    expertise: 'CSS/UX',
    email: 'john@example.com',
    profilePicture: 'https://via.placeholder.com/40',
  },
];

const CoursesPanelPage = () => {
  const [activeTable, setActiveTable] = useState('Courses');
  const [data, setData] = useState(initialCourses);
  const [editId, setEditId] = useState(null);

  const handleEdit = (id) => setEditId(id);

  const handleSave = (download = true) => {
    setEditId(null);
    if (download) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.download = `${activeTable.toLowerCase()}_data.json`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  };

  const handleChange = (e, id, field) => {
    const updated = data.map((item) => (item.id === id ? { ...item, [field]: e.target.value } : item));
    setData(updated);
  };

  const handleAdd = () => {
    let newEntry;
    if (activeTable === 'Courses') {
      newEntry = {
        id: Date.now(),
        courseName: '',
        startDate: '',
        endDate: '',
        image: '',
        description: '',
        benefits: '',
        targetAudience: '',
        additionalInfo: '',
        fee: '',
        maxStudents: '',
        enrolledStudents: '',
        placesLeft: '',
        status: '',
        rating: '',
      };
    } else if (activeTable === 'Users') {
      newEntry = {
        id: Date.now(),
        firstName: '',
        lastName: '',
        phone: '',
        country: '',
        email: '',
        createdAt: '',
        updatedAt: '',
      };
    } else if (activeTable === 'Instructors') {
      newEntry = {
        id: Date.now(),
        firstName: '',
        lastName: '',
        courseName: '',
        description: '',
        expertise: '',
        email: '',
        profilePicture: '',
      };
    }
    setData([...data, newEntry]);
    setEditId(newEntry.id);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleTableSwitch = (table) => {
    setEditId(null);
    setActiveTable(table);
    if (table === 'Courses') setData(initialCourses);
    else if (table === 'Users') setData(initialUsers);
    else if (table === 'Instructors') setData(initialInstructors);
  };

  const getTableHeaders = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  return (
    <div className="courses-panel-container">
      <div className="button-row">
        <select
          className="blue-button dropdown"
          onChange={(e) => handleTableSwitch(e.target.value)}
          value={activeTable}
        >
          <option value="Courses">Courses</option>
          <option value="Users">Users</option>
          <option value="Instructors">Instructors</option>
        </select>
        <button type="button" className="blue-button" onClick={handleAdd}>Add</button>
        <button type="button" className="blue-button" onClick={handleSave}>Save</button>
      </div>

      <table className="courses-table small-table">
        <thead>
          <tr>
            {getTableHeaders().map((header) => (
              <th key={header}>{header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.id} className={index % 2 ? 'alt-row' : ''}>
              {Object.entries(entry).map(([key, value]) => {
                let cellContent;

                if (editId === entry.id) {
                  cellContent = (
                    <input
                      value={value}
                      onChange={(e) => handleChange(e, entry.id, key)}
                    />
                  );
                } else if (key.toLowerCase().includes('image') || key === 'profilePicture') {
                  cellContent = <img src={value} alt="preview" className="course-img" />;
                } else {
                  cellContent = value;
                }

                return <td key={key}>{cellContent}</td>;
              })}

              <td>
                {editId === entry.id ? (
                  <button type="button" onClick={() => handleSave(false)}>Done</button>
                ) : (
                  <button type="button" onClick={() => handleEdit(entry.id)}>Edit</button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  disabled={editId !== null && editId !== entry.id}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoursesPanelPage;
