import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import apiService from "../services/apiService";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    sortBy: "name",
    sortOrder: "ASC",
  });

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Load stores
  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await apiService.stores.getStores(filters);
      setStores(response.data.stores);
    } catch (error) {
      console.error("Error loading stores:", error);
      alert("Error loading stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, [filters]);

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle sorting
  const handleSort = (field) => {
    setFilters({
      ...filters,
      sortBy: field,
      sortOrder:
        filters.sortBy === field && filters.sortOrder === "ASC"
          ? "DESC"
          : "ASC",
    });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      name: "",
      address: "",
      sortBy: "name",
      sortOrder: "ASC",
    });
  };

  // Open rating modal
  const openRatingModal = (store) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  // Handle rating submission
  const handleRatingSuccess = () => {
    setShowRatingModal(false);
    setSelectedStore(null);
    loadStores();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <div className="header-left">
                <div className="header-logo">S</div>
                <h1 className="header-title">Store Directory</h1>
              </div>
              <p className="header-subtitle">
                Discover and rate amazing stores in your area
              </p>
            </div>

            <div className="header-actions">
              <div className="welcome-badge">Welcome, {currentUser?.name}</div>
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
        </div>

        {/* Search and Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h3 className="filters-title">Search & Filter Stores</h3>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">STORE NAME</label>
              <input
                type="text"
                name="name"
                placeholder="Search by store name"
                value={filters.name}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">ADDRESS</label>
              <input
                type="text"
                name="address"
                placeholder="Search by address"
                value={filters.address}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">SORT BY</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="address">Sort by Address</option>
                <option value="overallRating">Sort by Rating</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">ORDER</label>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Stores List Section */}
        <div className="stores-section">
          <div className="stores-header">
            <h3 className="stores-title">Available Stores</h3>
            <div className="stores-count">
              {stores.length} store{stores.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              Loading stores...
            </div>
          ) : stores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <p className="empty-text">
                No stores found matching your criteria
              </p>
            </div>
          ) : (
            <div className="stores-grid">
              {stores.map((store) => (
                <div key={store.id} className="store-card">
                  {/* Store Header */}
                  <div className="store-header">
                    <h4 className="store-name">{store.name}</h4>
                    <p className="store-address">
                      <span>📍</span>
                      {store.address}
                    </p>
                  </div>

                  {/* Ratings Section */}
                  <div className="ratings-section">
                    <div className="rating-card">
                      <div className="rating-label">OVERALL RATING</div>
                      {store.overallRating ? (
                        <div>
                          <div className="rating-stars">
                            {"★".repeat(Math.round(store.overallRating))}
                            {"☆".repeat(5 - Math.round(store.overallRating))}
                          </div>
                          <div className="rating-value">
                            {store.overallRating}/5
                          </div>
                        </div>
                      ) : (
                        <div className="rating-empty">No ratings yet</div>
                      )}
                    </div>

                    <div className="rating-card">
                      <div className="rating-label">YOUR RATING</div>
                      {store.userRating ? (
                        <div>
                          <div className="rating-stars">
                            {"★".repeat(store.userRating)}
                            {"☆".repeat(5 - store.userRating)}
                          </div>
                          <div className="rating-value">
                            {store.userRating}/5
                          </div>
                        </div>
                      ) : (
                        <div className="rating-empty">Not rated yet</div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openRatingModal(store)}
                    className={`rate-store-btn ${
                      store.userRating ? "update" : "new"
                    }`}
                  >
                    {store.userRating ? "UPDATE RATING" : "RATE STORE"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedStore && (
        <RatingModal
          store={selectedStore}
          onClose={() => setShowRatingModal(false)}
          onSuccess={handleRatingSuccess}
        />
      )}
    </div>
  );
};

// Enhanced Password Change Modal
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
      <div className="modal-content password">
        <div className="modal-header">
          <h3 className="modal-title">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`modal-input ${errors.currentPassword ? "error" : ""}`}
              required
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
              className={`modal-input ${errors.newPassword ? "error" : ""}`}
              required
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
              className={`modal-input ${errors.confirmPassword ? "error" : ""}`}
              required
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

// Enhanced Rating Modal
const RatingModal = ({ store, onClose, onSuccess }) => {
  const [rating, setRating] = useState(store.userRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiService.stores.submitRating({
        storeId: store.id,
        rating: rating,
      });
      alert(
        store.userRating
          ? "Rating updated successfully!"
          : "Rating submitted successfully!"
      );
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content rating">
        <div className="modal-header">
          <h3 className="modal-title">
            {store.userRating ? "Update" : "Submit"} Rating for {store.name}
          </h3>
        </div>

        <div className="store-info">
          <p>
            <strong>Store:</strong> {store.name}
          </p>
          <p>
            <strong>Address:</strong> {store.address}
          </p>
          <p>
            <strong>Current Overall Rating:</strong>{" "}
            {store.overallRating
              ? `${store.overallRating}/5`
              : "No ratings yet"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rating-input-section">
            <label className="rating-input-label">
              Your Rating (1-5 stars):
            </label>
            <div className="rating-stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`rating-star ${
                    (hoverRating || rating) >= star ? "active" : ""
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-feedback">
                You selected {rating} star{rating > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {error && <div className="modal-general-error">{error}</div>}

          <div className="rating-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="rating-btn cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rating-btn submit"
            >
              {loading
                ? "Submitting..."
                : store.userRating
                ? "Update Rating"
                : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;
