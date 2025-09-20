import { useState } from 'react';
import { loadUsers } from '../components/Users/UsersServices';

const useUserOperations = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

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
