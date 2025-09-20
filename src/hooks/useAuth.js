import { useState, useEffect } from 'react';

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const useAuth = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
  });

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;
    const payload = parseJwt(token);
    if (payload?.first_name) {
      setUser({
        first_name: payload.first_name,
        last_name: payload.last_name,
        avatar_url: payload.avatar_url || '',
      });
    }
  }, []);

  return { user, getAuthHeaders };
};

export default useAuth;
