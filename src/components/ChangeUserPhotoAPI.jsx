import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ChangeUserPhotoAPI = ({ trigger, imageFile, onResponse }) => {
  useEffect(() => {
    const uploadAvatar = async () => {
      if (!trigger || !imageFile) return;

      const token = sessionStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('avatar', imageFile);

      try {
        const response = await fetch('http://localhost:3000/upload_avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();
        onResponse(result);
      } catch (error) {
        onResponse({ error: 'Image upload failed' });
      }
    };

    uploadAvatar();
  }, [trigger, imageFile, onResponse]);

  return null;
};

ChangeUserPhotoAPI.propTypes = {
  trigger: PropTypes.bool.isRequired,
  imageFile: PropTypes.instanceOf(File).isRequired,
  onResponse: PropTypes.func.isRequired,
};

export default ChangeUserPhotoAPI;
