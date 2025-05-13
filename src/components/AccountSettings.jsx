import React, { useState, useEffect } from 'react';
import Footer from './ui/Footer';
import Navbar from './ui/Navbar';
import './AccountSettings.css';

const AccountSettings = () => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    country: '',
    mobile_number: '',
    email: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Save and lock fields
  const handleSubmit = (e) => {
    e.preventDefault();
    setEditable(false);

    const dataToSubmit = {
      ...formData,
      image: profileImage,
    };

    console.log('Submitting user data (not yet sent):', dataToSubmit);
    // Call your update API here when it's ready
  };

  // Fetch user data on load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch('http://localhost:3000/current_user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            country: data.country || '',
            mobile_number: data.mobile_number || '',
            email: data.email || '',
          });
        })
        .catch((err) => {
          console.error('Failed to fetch user:', err);
        });
    }
  }, []);

  // Autofocus first field when editable
  useEffect(() => {
    if (editable) {
      document.querySelector('input[name="first_name"]')?.focus();
    }
  }, [editable]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    // console.log('Editable state changed to:', editable);
  }, [editable]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="account-settings-main-div">
      <Navbar className="text-white" />
      <div className="settings-container">
        <h2 className="accountSettingsHeader">Settings</h2>

        <div className="section">
          <h3 className="d-flex justify-content-center">Profile Settings</h3>
          <p>Add information about yourself</p>

          <div className="edit-button-on-right d-flex justify-content-center">
            <div className="form-container col-lg-8">
              <form
                className="form-group-account-settings"
                onSubmit={(e) => {
                  if (editable) {
                    handleSubmit(e);
                  } else {
                    e.preventDefault(); // prevent accidental submission
                  }
                }}
              >

                <div className="form-inputs">

                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={!editable}
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={!editable}
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!editable}
                  />
                  <input
                    type="text"
                    name="mobile_number"
                    placeholder="Contact number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    disabled={!editable}
                  />
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editable}
                  />

                  <input
                    type="file"
                    onChange={handleImageChange}
                    disabled={!editable}
                  />
                  <div className="image-preview">
                    {preview && <img src={preview} alt="Preview" />}
                    <button type="button" className="upload-btn" disabled={!editable}>
                      Upload
                    </button>
                  </div>
                </div>

              </form>
            </div>
            <div className="form-actions col-lg-4 justify-content-center">
              <button
                type="button"
                className={editable ? 'submit-btn' : 'edit-btn'}
                onClick={() => {
                  if (editable) {
                    // simulate form submission
                    document.querySelector('.form-group-account-settings')?.dispatchEvent(
                      new Event('submit', { cancelable: true, bubbles: true }),
                    );
                  } else {
                    setEditable(true);
                  }
                }}
              >
                {editable ? 'Submit' : 'Edit'}
              </button>
            </div>
          </div>

        </div>

        <div className="section">
          <h3 className="d-flex justify-content-center">Profile Security</h3>
          <p>Edit your account settings and change your password here.</p>
          <form className="form-group-account-settings">
            <input type="password" placeholder="Old password" />
            <input type="password" placeholder="New password" />
            <input type="password" placeholder="Confirm password" />
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountSettings;
