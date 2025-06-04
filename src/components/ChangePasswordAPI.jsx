import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ChangePasswordAPI = ({ trigger, passwords, onResponse }) => {
  useEffect(() => {
    if (!trigger) return;

    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      onResponse({ error: 'No token found' });
      return;
    }

    fetch('http://localhost:3000/change_password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: passwords.current,
        new_password: passwords.new,
        new_password_confirmation: passwords.confirm,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          onResponse({ success: data.message });
        } else {
          onResponse({ error: data.error || 'Unknown error' });
        }
      })
      .catch((err) => {
        onResponse({ error: 'Request failed' });
        console.error('Password change error:', err);
      });
  }, [trigger]);

  return null; // Logic only
};

ChangePasswordAPI.propTypes = {
  trigger: PropTypes.bool.isRequired,
  passwords: PropTypes.shape({
    current: PropTypes.string,
    new: PropTypes.string,
    confirm: PropTypes.string,
  }).isRequired,
  onResponse: PropTypes.func.isRequired,
};

export default ChangePasswordAPI;
