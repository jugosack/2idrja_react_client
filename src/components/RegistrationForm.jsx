import './RegistrationForm.css';
import React, { useState } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import { Link } from 'react-router-dom';
import Footer from './ui/Footer';
import Navbar from './ui/Navbar';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    mobileNumber: '',
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const {
      name, value, type, checked,
    } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle country selection
  const handleCountryChange = (val) => {
    setFormData({ ...formData, country: val });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    setLoading(true);
    setMessage('');

    const requestBody = {
      user: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        country: formData.country,
        mobile_number: formData.mobileNumber,
        terms_of_use: formData.termsAccepted.toString(),
      },
    };

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful!');
      } else {
        setMessage(data.error || 'Something went wrong!');
      }
    } catch (error) {
      setMessage('Network error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar className="active text-white" />
      <div className="background-wallpaper-RF">
        <div className="container-fluid container">
          <div className="signup-form">
            <form onSubmit={handleSubmit}>
              <h2>Register</h2>
              <p className="hint-text">Create your account.</p>

              {/* Name Fields */}
              <div className="form-group row">
                <div className="col-12 col-md-6 pb-3 pb-lg-0">
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Country */}
              <div className="form-group">
                <CountryDropdown className="form-control" value={formData.country} onChange={handleCountryChange} />
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  required
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Passwords */}
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* Terms Checkbox */}
              <div className="form-group">
                <label className="form-check-label" htmlFor="termsCheckbox">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    required
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  {' '}
                  I accept the
                  {' '}
                  <span className="text-blue" style={{ cursor: 'pointer' }}>Terms of Use</span>
                  {' '}
                  &
                  {' '}
                  <span className="text-blue" style={{ cursor: 'pointer' }}>Privacy Policy</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="form-group btn-registry col-12">
                <button type="submit" className="btn btn-primary btn-lg col-12" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Now'}
                </button>
              </div>

              {/* Display message */}
              {message && <p className="text-center text-white">{message}</p>}
            </form>

            <div className="text-center text-white pb-5">
              Already have an account? &nbsp; &nbsp;
              <Link to="/login" className="text-blue">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationForm;
