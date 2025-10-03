// Navigation handlers for CoursesPanelPage
export const createNavigationHandlers = (navigate) => {
  const goHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    navigate('/login');
  };

  return {
    goHome,
    handleLogout,
  };
};

export default createNavigationHandlers;
