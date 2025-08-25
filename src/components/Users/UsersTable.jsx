/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EditUserForm from './EditUserForm';
import DeleteUserModal from './DeleteUserModal';
import UserDetailsModal from './UserDetailsModal';
import { deleteUser } from './UsersServices';
import './UsersTable.css';

function UsersTable({ users, onUserUpdate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersPerPage, setUsersPerPage] = useState('Users');
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = React.useMemo(() => {
    if (searchTerm.length < 2) return users;
    return users.filter((user) =>
      Object.values(user).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    const sorted = [...filteredUsers].sort((a, b) => {
      const aVal = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
      const bVal = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredUsers, sortConfig]);

  const indexOfLastUser = currentPage * (usersPerPage === 'Users' ? users.length : usersPerPage);
  const indexOfFirstUser = indexOfLastUser - (usersPerPage === 'Users' ? users.length : usersPerPage);
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / (usersPerPage === 'Users' ? users.length : usersPerPage));

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const handleEditClick = (user) => {
    console.log('Editing user:', user);
    console.log('User ID:', user.id);
    console.log('User ID type:', typeof user.id);
    setEditingUser(user);
  };

  const handleSave = async (updatedUser) => {
    try {
      // Update the users array with the edited user
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      
      // Call the callback to update users in the parent component
      if (onUserUpdate) {
        onUserUpdate(updatedUsers);
      }
      
      console.log('Updated User:', updatedUser);
      console.log('Updated Users Array:', updatedUsers);
      setEditingUser(null);
      
      // Optionally refresh the users list to ensure we have the latest data
      // This is useful if other users might be editing the same data
      // You can uncomment this if you want to always fetch fresh data
      // await refreshUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteClick = (user) => {
    console.log('🔍 handleDeleteClick called with:', user);
    console.log('🔍 User ID:', user?.id);
    console.log('🔍 User object:', user);
    setDeletingUser(user);
  };

  const handleDelete = async (userId) => {
    console.log('🔍 handleDelete called with userId:', userId);
    console.log('🔍 userId type:', typeof userId);
    setIsDeleting(true);
    try {
      await deleteUser(userId);
      const updatedUsers = users.filter((user) => user.id !== userId);
      
      // Call the callback to update users in the parent component
      if (onUserUpdate) {
        onUserUpdate(updatedUsers);
      }
      
      console.log('User deleted:', userId);
      alert('User deleted successfully!');
      setDeletingUser(null); // Close the delete modal
    } catch (error) {
      console.error('Error deleting user:', error);
      let errorMessage = 'Failed to delete user';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'User not found. Please refresh and try again.';
        } else if (error.response.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'Forbidden. You do not have permission to delete this user.';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023); // Mobile S, M, and L
      setIsLargeScreen(window.innerWidth >= 1024); // Laptop and above
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="users-table-container">
      <div className="users-table-header">
        {/* Search bar toggle */}
        {(searchVisible || isMobile || isLargeScreen) && (
          <input
            type="text"
            placeholder="Search Users"
            value={searchTerm}
            className={`users-search-input ${isMobile ? 'mobile-centered' : ''}`}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        )}
        {!isMobile && !isLargeScreen && (
          <button
            className="users-search-icon"
            onClick={() => setSearchVisible((prev) => !prev)}
          >
            🔍
          </button>
          )}
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th className="users-th" onClick={() => requestSort('id')}>
                ID
                <span className="users-sort-icon">{getSortIcon('id')}</span>
              </th>
              <th className="users-th" onClick={() => requestSort('first_name')}>
                First Name
                <span className="users-sort-icon">{getSortIcon('first_name')}</span>
              </th>
              <th className="users-th" onClick={() => requestSort('last_name')}>
                Last Name
                <span className="users-sort-icon">{getSortIcon('last_name')}</span>
              </th>
              <th className="users-th" onClick={() => requestSort('country')}>
                Country
                <span className="users-sort-icon">{getSortIcon('country')}</span>
              </th>
              <th className="users-th" onClick={() => requestSort('email')}>
                Email
                <span className="users-sort-icon">{getSortIcon('email')}</span>
              </th>
              <th className="users-th" onClick={() => requestSort('mobile_number')}>
                Mobile Number
                <span className="users-sort-icon">{getSortIcon('mobile_number')}</span>
              </th>
              {isLargeScreen && (
                <th className="users-th">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`users-tr ${!isLargeScreen ? 'clickable-row' : ''}`}
                  onClick={!isLargeScreen ? () => handleRowClick(user) : undefined}
                >
                  <td className="users-td">{user.id}</td>
                  <td className="users-td">{user.first_name}</td>
                  <td className="users-td">{user.last_name}</td>
                  <td className="users-td">{user.country}</td>
                  <td className="users-td">{user.email}</td>
                  <td className="users-td">{user.mobile_number}</td>
                  {isLargeScreen && (
                    <td className="users-td">
                      <button
                        type="button"
                        className="users-btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(user);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="users-btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(user);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isLargeScreen ? 7 : 6} className="users-td users-no-data">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rows per page dropdown */}
      <div className="users-dropdown-container">
        <select
          className="users-dropdown"
          value={usersPerPage}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'Users') {
              setUsersPerPage('Users');
            } else {
              setUsersPerPage(Number(val));
            }
            setCurrentPage(1);
          }}
        >
          <option value="Users">Show all users</option>
          <option value={1}>1 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {usersPerPage !== 'Users' && (
        <div className="users-pagination-container">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`users-btn-page ${currentPage === 1 ? 'disabled' : ''}`}
          >
            Previous
          </button>
          <span className="users-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`users-btn-page ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            Next
          </button>
        </div>
      )}

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDelete={handleDelete}
        />
      )}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={(user) => {
            setSelectedUser(null);
            handleEditClick(user);
          }}
          onDelete={(user) => {
            setSelectedUser(null);
            handleDeleteClick(user);
          }}
        />
      )}
    </div>
  );
}

UsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  onUserUpdate: PropTypes.func,
};

export default UsersTable;
