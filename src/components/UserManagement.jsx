import React, { useEffect } from 'react';
import UsersTable from './Users/UsersTable';
import AddUserForm from './Users/AddUserForm';
import useUserOperations from '../hooks/useUserOperations';

const UserManagement = () => {
  const {
    users,
    showAddUserModal,
    setUsers,
    setShowAddUserModal,
    handleUserAdded,
    openAddUserModal,
  } = useUserOperations();

  // Listen for custom events to open modals
  useEffect(() => {
    const handleOpenAddUserModal = () => {
      openAddUserModal();
    };

    window.addEventListener('openAddUserModal', handleOpenAddUserModal);
    return () => window.removeEventListener('openAddUserModal', handleOpenAddUserModal);
  }, [openAddUserModal]);

  return (
    <>
      <UsersTable users={users} onUserUpdate={setUsers} />

      {showAddUserModal && (
        <AddUserForm
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}
    </>
  );
};

export default UserManagement;
