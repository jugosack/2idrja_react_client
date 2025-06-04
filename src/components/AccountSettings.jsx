import React, { useState, useEffect } from 'react';
import Footer from './ui/Footer';
import Navbar from './ui/NavbarALT';
import './AccountSettings.css';
import UserDataLoader from './LoadUserDataFromAPI';
import ChangePasswordAPI from './ChangePasswordAPI';
import EditUserAPI from './EditUserDataAPI';
import ChangeUserPhotoAPI from './ChangeUserPhotoAPI';
import EyePassword from './icons/eye-svgrepo-com.svg';
import EyeOffPassword from './icons/eye-off-svgrepo-com.svg';

const AccountSettings = () => {
  const [editable, setEditable] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    country: '',
    mobile_number: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [submitPassword, setSubmitPassword] = useState(false);
  const [passwordResponse, setPasswordResponse] = useState(null);

  const [preview, setPreview] = useState(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitUserData, setSubmitUserData] = useState(false);
  const [userUpdateResponse, setUserUpdateResponse] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [submitPhoto, setSubmitPhoto] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);

  // Save and lock fields
  const handleSubmit = (e) => {
    e.preventDefault();
    setEditable(false);
    // const dataToSubmit = { ...formData };
    // console.log('Submitting user data (no image):', dataToSubmit);
    setSubmitUserData(true); // Trigger the API request
  };

  // Fetch user data on load
  useEffect(() => {
  }, []);

  useEffect(() => {
    if (passwordResponse) {
      const timer = setTimeout(() => {
        setPasswordResponse(null);
        setTriedSubmit(false); // clear message visibility
      }, 8000);

      return () => clearTimeout(timer);
    }

    return undefined; // satisfies ESLint's expected return
  }, [passwordResponse]);

  useEffect(() => {
    if (userUpdateResponse) {
      const timer = setTimeout(() => {
        setUserUpdateResponse(null);
      }, 8000); // disappears after 14 seconds

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [userUpdateResponse]);

  useEffect(() => {
    if (!submitPassword) {
      setTriedSubmit(false);
    }
  }, [submitPassword]);

  useEffect(() => {
    if (triedSubmit && passwords.new === passwords.confirm) {
      setTriedSubmit(false);
    }
  }, [passwords, triedSubmit]);

  // Autofocus first field when editable
  useEffect(() => {
    if (editable) {
      document.querySelector('input[name="first_name"]')?.focus();
    }
  }, [editable]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
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
      <EditUserAPI
        trigger={submitUserData}
        userData={formData}
        onResponse={(res) => {
          // console.log('User update response:', res);
          setUserUpdateResponse(res);
          setSubmitUserData(false); // Reset trigger
        }}
      />

      <UserDataLoader onDataLoaded={setFormData} />
      <div className="settings-container">
        <h2 className="accountSettingsHeader">Settings</h2>

        <div className="section-account-settings">
          <h3 className="d-flex justify-content-center">Profile Settings</h3>
          <p>Add information about yourself</p>

          <div className="form-button-and-api-response-maindiv">
            <div className="form-and-button-container">
              <div className="form-fields-container">
                <form
                  className="form-group-account-settings"
                  onSubmit={handleSubmit}
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

                    <div className="joining-image-field">

                      <div className="image-placeholder">Image Preview</div>

                      <input
                        type="file"
                        id="file-upload-image"
                        onChange={handleImageChange}
                        disabled={!editable}
                      />
                      <div className="image-preview">
                        {preview && <img src={preview} alt="Preview" />}
                        <button
                          type="button"
                          className="upload-btn"
                          disabled={!editable || !imageFile}
                          onClick={() => setSubmitPhoto(true)}
                        >
                          Upload
                        </button>

                      </div>

                      {uploadResponse && (
                        <div className="api-response-message">
                          {uploadResponse.message || uploadResponse.error || 'Upload failed'}
                        </div>
                      )}

                    </div>
                  </div>

                </form>
              </div>
              <div className="form-button-switch">
                <button
                  type="button"
                  className={editable ? 'submit-btn' : 'edit-btn'}
                  onClick={() => {
                    if (editable) {
                      // If we're in editable mode and the user clicks "Submit"
                      document.querySelector('.form-group-account-settings')?.requestSubmit();
                    } else {
                      // If user clicks "Edit", enable fields
                      setEditable(true);
                    }
                  }}
                >
                  {editable ? 'Submit' : 'Edit'}
                </button>

              </div>
            </div>
            {userUpdateResponse && (
              <div className="api-response-message">
                {userUpdateResponse.success || 'Update failed'}
              </div>
            )}
          </div>
          <ChangeUserPhotoAPI
            trigger={submitPhoto}
            imageFile={imageFile}
            onResponse={(res) => {
              setUploadResponse(res);
              setSubmitPhoto(false);
              // optionally update preview with returned URL
              if (res.avatar_url) {
                setPreview(res.avatar_url);
              }
            }}
          />

        </div>

        <div className="section-account-settings" id="section-account-settings-password-section">
          <ChangePasswordAPI
            trigger={submitPassword}
            passwords={passwords}
            onResponse={(res) => {
              setPasswordResponse(res);
              setSubmitPassword(false); // Reset trigger

              if (res.success) {
                setPasswords({ current: '', new: '', confirm: '' }); // Clear password fields
              }
            }}
          />

          <h3 className="d-flex justify-content-center">Profile Security</h3>
          <p>Edit your account settings and change your password here.</p>
          <div className="form-and-button-container">
            <div className="form-fields-container">
              <form className="form-group-account-settings">
                <div className="password-input-wrapper">
                  <input
                    className="password-input-account-settings"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Old password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="password-toggle-button"
                    aria-label="Toggle current password visibility"
                  >
                    <img
                      src={
                        showCurrentPassword ? EyePassword : EyeOffPassword
                      }
                      alt=""
                      aria-hidden="true"
                    />
                  </button>

                </div>

                <div className="password-input-wrapper">
                  <input
                    className="password-input-account-settings"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="password-toggle-button"
                    aria-label="Toggle current password visibility"
                  >
                    <img
                      src={
                        showNewPassword ? EyePassword : EyeOffPassword
                      }
                      alt="Toggle visibility"

                    />
                  </button>
                </div>

                <div className="password-input-wrapper">
                  <input
                    className="password-input-account-settings"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="password-toggle-button"
                    aria-label="Toggle current password visibility"
                  >
                    <img
                      src={
                        showConfirmPassword ? EyePassword : EyeOffPassword
                      }
                      alt="Toggle visibility"

                    />
                  </button>

                </div>

                {passwordResponse && (
                  <div className="api-response-message">
                    {passwordResponse && (
                      <div className="api-response-message">
                        {passwordResponse.success || 'Something went wrong.'}
                      </div>
                    )}
                  </div>
                )}
                {triedSubmit && passwords.new !== passwords.confirm && (
                  <div className="error-message" style={{ color: 'red' }}>
                    New password and confirmation do not match.
                  </div>
                )}

              </form>
            </div>
            <div className="form-button-switch">
              <button
                type="button"
                className="submit-btn"
                onClick={() => {
                  setTriedSubmit(true); // mark that user tried to submit
                  if (passwords.new !== passwords.confirm) {
                    return; // prevent submission
                  }
                  setSubmitPassword(true);
                }}
              >
                Submit
              </button>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountSettings;
