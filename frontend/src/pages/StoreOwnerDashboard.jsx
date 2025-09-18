import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import apiService from "../services/apiService";
import "./StoreOwnerDashboard.css";

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    store: null,
    averageRating: 0,
    ratingUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("DESC"); // Default to newest first

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Load dashboard data
  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.storeOwner.getDashboard();

      // Check if the response indicates no store assigned
      if (!response.data || !response.data.store) {
        setDashboardData({
          store: null,
          averageRating: 0,
          ratingUsers: [],
        });
      } else {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);

      // Handle errors
      if (error.response?.status === 404) {
        // No store found - this is expected for unassigned store owners
        setDashboardData({
          store: null,
          averageRating: 0,
          ratingUsers: [],
        });
      } else if (error.response?.status === 403) {
        setError("Access denied. Please contact the administrator.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later or contact support.");
      } else {
        setError(
          "Unable to load dashboard. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Sort rating users - add safety check
  const sortedRatingUsers = dashboardData.ratingUsers
    ? [...dashboardData.ratingUsers].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
      })
    : [];

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="store-dashboard-page loading">
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="store-dashboard-page error">
        {/* Header */}
        <div className="store-header">
          <div className="store-header-left">
            <div className="store-logo">S</div>
            <div className="store-header-content">
              <h1 className="store-title">Store Owner Dashboard</h1>
              <p className="store-subtitle">
                Manage your store and monitor customer feedback
              </p>
            </div>
          </div>
          <div className="store-header-actions">
            <span className="welcome-badge">Welcome, {currentUser?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={loadDashboard}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No store assigned state
  if (!dashboardData.store) {
    return (
      <div className="store-dashboard-page no-store">
        {/* Header */}
        <div className="store-header">
          <div className="store-header-left">
            <div className="store-logo">S</div>
            <div className="store-header-content">
              <h1 className="store-title">Store Owner Dashboard</h1>
              <p className="store-subtitle">
                Manage your store and monitor customer feedback
              </p>
            </div>
          </div>
          <div className="store-header-actions">
            <span className="welcome-badge">Welcome, {currentUser?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="no-store-content">
          <div className="no-store-icon">🏪</div>
          <h3 className="no-store-title">No Store Assigned</h3>
          <p className="no-store-message">
            No store has been assigned to your account yet. Please contact the
            administrator to have a store assigned to you.
          </p>
          <button className="retry-btn" onClick={loadDashboard}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="store-dashboard-page">
      {/* Header */}
      <div className="store-header">
        <div className="store-header-left">
          <div className="store-logo">S</div>
          <div className="store-header-content">
            <h1 className="store-title">Store Owner Dashboard</h1>
            <p className="store-subtitle">
              Manage your store and monitor customer feedback
            </p>
          </div>
        </div>
        <div className="store-header-actions">
          <span className="welcome-badge">Welcome, {currentUser?.name}</span>
          <button
            className="change-password-btn"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Store Name Card */}
        <div className="stat-card store-name">
          <div className="stat-card-content">
            <div className="stat-card-text">
              <div className="stat-number">{dashboardData.store.name}</div>
              <div className="stat-label">Your Store</div>
            </div>
            <div className="stat-icon">🏪</div>
          </div>
        </div>

        {/* Average Rating Card */}
        <div className="stat-card rating">
          <div className="stat-card-content">
            <div className="stat-card-text">
              <div className="stat-number">
                {dashboardData.averageRating || "0.0"}
              </div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-icon">⭐</div>
          </div>
        </div>

        {/* Total Reviews Card */}
        <div className="stat-card reviews">
          <div className="stat-card-content">
            <div className="stat-card-text">
              <div className="stat-number">
                {dashboardData.ratingUsers?.length || 0}
              </div>
              <div className="stat-label">Total Reviews</div>
            </div>
            <div className="stat-icon">📝</div>
          </div>
        </div>
      </div>

      {/* Rating Display */}
      <div className="rating-display">
        {dashboardData.averageRating ? (
          <div>
            <div className="rating-stars">
              {"★".repeat(Math.round(dashboardData.averageRating))}
              {"☆".repeat(5 - Math.round(dashboardData.averageRating))}
            </div>
            <p className="rating-text">
              {dashboardData.averageRating}/5 based on{" "}
              {dashboardData.ratingUsers?.length || 0} review
              {(dashboardData.ratingUsers?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>
        ) : (
          <p className="rating-text">No ratings received yet</p>
        )}
      </div>

      {/* Customer Reviews */}
      <div className="reviews-section">
        <div className="reviews-header">
          <div className="reviews-controls">
            <h3 className="reviews-title">Customer Reviews</h3>
            {sortedRatingUsers.length > 0 && (
              <div className="sort-controls">
                <label className="sort-label">Sort by date:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="sort-select"
                >
                  <option value="DESC">Newest First</option>
                  <option value="ASC">Oldest First</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {sortedRatingUsers.length === 0 ? (
          <div className="empty-reviews">
            <div className="empty-reviews-icon">📝</div>
            <p className="empty-reviews-text">
              No reviews yet. Encourage your customers to rate your store!
            </p>
          </div>
        ) : (
          <div className="reviews-list">
            {sortedRatingUsers.map((user) => (
              <div key={user.id} className="review-card">
                <div className="review-content">
                  <div className="review-main">
                    <div className="review-user">
                      <h4 className="review-user-name">{user.name}</h4>
                      <p className="review-user-email">{user.email}</p>
                      <p className="review-date">
                        Rated on: {formatDate(user.created_at)}
                      </p>
                    </div>
                    <div className="review-rating">
                      <div className="review-stars">
                        {"★".repeat(user.rating)}
                        {"☆".repeat(5 - user.rating)}
                      </div>
                      <span
                        className={`review-badge ${
                          user.rating >= 4
                            ? "high"
                            : user.rating >= 3
                            ? "medium"
                            : "low"
                        }`}
                      >
                        {user.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Distribution */}
      {sortedRatingUsers.length > 0 && (
        <div className="rating-distribution">
          <h3 className="distribution-title">Rating Distribution</h3>
          <RatingDistribution ratings={sortedRatingUsers} />
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

// Rating Distribution Component
const RatingDistribution = ({ ratings }) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  // Add safety check for ratings array
  if (ratings && Array.isArray(ratings)) {
    ratings.forEach((rating) => {
      if (
        rating &&
        rating.rating &&
        distribution.hasOwnProperty(rating.rating)
      ) {
        distribution[rating.rating]++;
      }
    });
  }

  const totalRatings = ratings?.length || 0;

  return (
    <div className="distribution-list">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star];
        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

        return (
          <div key={star} className="distribution-item">
            <span className="distribution-star">{star}★</span>
            <div className="distribution-bar">
              <div
                className="distribution-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="distribution-count">
              {count} ({percentage.toFixed(1)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Password Change Modal Component
const PasswordChangeModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (
      !formData.newPassword ||
      formData.newPassword.length < 8 ||
      formData.newPassword.length > 16
    ) {
      newErrors.newPassword = "Password must be between 8 and 16 characters";
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter and one special character";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await authService.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      alert("Password updated successfully!");
      onClose();
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Change Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="modal-input"
            />
            {errors.currentPassword && (
              <div className="modal-error">{errors.currentPassword}</div>
            )}
          </div>

          <div className="modal-form-group">
            <label className="modal-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="modal-input"
            />
            {errors.newPassword && (
              <div className="modal-error">{errors.newPassword}</div>
            )}
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="modal-input"
            />
            {errors.confirmPassword && (
              <div className="modal-error">{errors.confirmPassword}</div>
            )}
          </div>

          {errors.general && (
            <div className="modal-general-error">{errors.general}</div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="modal-btn submit"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
