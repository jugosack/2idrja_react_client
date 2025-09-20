import { useState, useEffect } from 'react';
import { loadUsers } from '../components/Users/UsersServices';

const useUserOperations = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Load users when component mounts
  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const usersData = await loadUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsersData();
  }, []);

  const handleUserAdded = async () => {
    try {
      const updatedUsers = await loadUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  const openAddUserModal = () => {
    setShowAddUserModal(true);
  };

  return {
    // State
    users,
    showAddUserModal,
    // Actions
    setUsers,
    setShowAddUserModal,
    handleUserAdded,
    openAddUserModal,
  };
};

export default useUserOperations;
