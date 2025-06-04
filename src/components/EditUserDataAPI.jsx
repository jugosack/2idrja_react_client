import { useEffect } from 'react';
import PropTypes from 'prop-types';

const EditUserDataAPI = ({ trigger, userData, onResponse }) => {
  useEffect(() => {
    if (!trigger || !userData) return;

    const token = sessionStorage.getItem('auth_token');

    if (!token) {
      onResponse({ error: 'No token found' });
      return;
    }

    // console.log('Sending userData to API:', userData);

    const updateUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/edit_user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: userData }),
        });

        const result = await response.json();

        if (result.message) {
          onResponse({ success: result.message, data: result.user });
        } else {
          onResponse({ error: result.error || 'Update failed' });
        }
      } catch (error) {
        console.error('Edit user error:', error);
        onResponse({ error: 'Something went wrong' });
      }
    };

    updateUser();
  }, [trigger, userData, onResponse]);

  return null; // This component does not render anything
};

EditUserDataAPI.propTypes = {
  trigger: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    country: PropTypes.string,
    mobile_number: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  onResponse: PropTypes.func.isRequired,
};

export default EditUserDataAPI;
