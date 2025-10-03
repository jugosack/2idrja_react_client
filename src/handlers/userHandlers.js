// User handlers for CoursesPanelPage
export const createUserHandlers = () => {
  const openAddUserModal = () => {
    // Trigger user modal opening via custom event
    const event = new CustomEvent('openAddUserModal');
    window.dispatchEvent(event);
  };

  return {
    openAddUserModal,
  };
};

export default createUserHandlers;
