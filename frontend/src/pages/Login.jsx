import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading) return;

    setLoading(true);

    try {
      const response = await authService.login(formData);
      const user = response.user;

      // Redirect based on user role
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "user":
          navigate("/dashboard");
          break;
        case "store_owner":
          navigate("/store-owner");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      console.log("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage =
            "Invalid email or password. Please check your credentials.";
        } else if (error.response.status === 404) {
          errorMessage = "Account not found. Please check your email address.";
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your internet connection.";
      }

      // Show browser alert instead of inline error message
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Content */}
        <div className="login-content">
          {/* Header Section */}
          <div className="login-header">
            <div className="login-logo">S</div>
            <h2 className="login-title">Store Rating System</h2>
            <p className="login-subtitle">
              Welcome back! Please sign in to your account
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL ADDRESS
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                PASSWORD
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <div className="loading-content">
                  <div className="loading-spinner" />
                  <span className="loading-text">Signing In...</span>
                </div>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="register-section">
            <p className="register-text">
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
