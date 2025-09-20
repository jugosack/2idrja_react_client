import React from 'react';
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
  } = useUserOperations();

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
