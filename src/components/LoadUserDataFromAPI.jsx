import { useEffect } from 'react';
import PropTypes from 'prop-types';

const LoadUserDataFromAPI = ({ onDataLoaded }) => {
  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      fetch('http://localhost:3000/current_user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          onDataLoaded({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            country: data.country || '',
            mobile_number: data.mobile_number || '',
            email: data.email || '',
          });
        })
        .catch((err) => {
        // eslint-disable-next-line
          console.error('Failed to fetch user:', err);
        });
    }
  }, [onDataLoaded]);

  return null; // No UI — logic only
};

LoadUserDataFromAPI.propTypes = {
  onDataLoaded: PropTypes.func.isRequired,
};

export default LoadUserDataFromAPI;
