import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "Password must be between 8 and 16 characters";
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter and one special character";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    } else if (formData.address.length > 400) {
      newErrors.address = "Address must be less than 400 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await authService.register(formData);
      alert("Registration successful! Please login with your credentials.");
      navigate("/login");
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-content">
          {/* Header Section */}
          <div className="register-header">
            <div className="register-logo">+</div>
            <h2 className="register-title">Create Your Account</h2>
            <p className="register-subtitle">
              Join our store rating community today
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                FULL NAME
                <span className="label-hint">(20-60 characters)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full legal name"
                className={`form-input ${errors.name ? "error" : ""}`}
                required
                autoComplete="off"
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
              <div className="helper-text">
                {formData.name.length}/60 characters
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`form-input ${errors.email ? "error" : ""}`}
                required
                autoComplete="off"
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                PASSWORD
                <span className="label-hint">
                  (8-16 chars, 1 uppercase, 1 special)
                </span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                className={`form-input ${errors.password ? "error" : ""}`}
                required
                autoComplete="off"
              />
              {errors.password && (
                <div className="error-text">{errors.password}</div>
              )}
              <div className="helper-text password-indicators">
                <span
                  className={`password-indicator ${
                    formData.password.length >= 8 &&
                    formData.password.length <= 16
                      ? "valid"
                      : ""
                  }`}
                >
                  Length: {formData.password.length}/16
                </span>
                <span
                  className={`password-indicator ${
                    /(?=.*[A-Z])/.test(formData.password) ? "valid" : ""
                  }`}
                >
                  Uppercase: {/(?=.*[A-Z])/.test(formData.password) ? "✓" : "✗"}
                </span>
                <span
                  className={`password-indicator ${
                    /(?=.*[!@#$%^&*])/.test(formData.password) ? "valid" : ""
                  }`}
                >
                  Special:{" "}
                  {/(?=.*[!@#$%^&*])/.test(formData.password) ? "✓" : "✗"}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                ADDRESS
                <span className="label-hint">(max 400 characters)</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows="3"
                className={`form-input form-textarea ${
                  errors.address ? "error" : ""
                }`}
                required
                autoComplete="off"
              />
              {errors.address && (
                <div className="error-text">{errors.address}</div>
              )}
              <div className="helper-text">
                {formData.address.length}/400 characters
              </div>
            </div>

            {errors.general && (
              <div className="general-error">{errors.general}</div>
            )}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <span className="loading-content">
                  <span className="loading-spinner" />
                  CREATING ACCOUNT...
                </span>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="login-section">
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
