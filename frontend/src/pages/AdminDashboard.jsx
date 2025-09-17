import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import apiService from "../services/apiService";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'user' or 'store'
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    sortBy: "name",
    sortOrder: "ASC",
  });

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Load dashboard stats
  const loadStats = async () => {
    try {
      const response = await apiService.admin.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Load users with filters
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.admin.getUsers(filters);
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load stores with filters
  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await apiService.admin.getStores(filters);
      setStores(response.data);
    } catch (error) {
      console.error("Error loading stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "stores") {
      loadStores();
    }
  }, [activeTab, filters]);

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
      email: "",
      address: "",
      role: "",
      sortBy: "name",
      sortOrder: "ASC",
    });
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        {/* Header Section */}
        <div className="admin-header">
          <div className="header-content">
            <div>
              <div className="header-left">
                <div className="admin-logo">A</div>
                <h1 className="admin-title">Admin Dashboard</h1>
              </div>
              <p className="admin-subtitle">
                Manage users, stores, and monitor system performance
              </p>
            </div>

            <div className="header-actions">
              <div className="admin-welcome-badge">
                Welcome, {currentUser?.name}
              </div>
              <button className="admin-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <div className="tabs-list">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "users", label: "Users", icon: "👥" },
              { id: "stores", label: "Stores", icon: "🏪" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${
                  activeTab === tab.id ? "active" : "inactive"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card users">
                <div className="stat-card-content">
                  <div>
                    <div className="stat-number">{stats.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                  <div className="stat-icon">👥</div>
                </div>
              </div>

              <div className="stat-card stores">
                <div className="stat-card-content">
                  <div>
                    <div className="stat-number">{stats.totalStores}</div>
                    <div className="stat-label">Total Stores</div>
                  </div>
                  <div className="stat-icon">🏪</div>
                </div>
              </div>

              <div className="stat-card ratings">
                <div className="stat-card-content">
                  <div>
                    <div className="stat-number">{stats.totalRatings}</div>
                    <div className="stat-label">Total Ratings</div>
                  </div>
                  <div className="stat-icon">⭐</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div className="quick-actions-header">
                <h3 className="quick-actions-title">Quick Actions</h3>
              </div>
              <div className="action-buttons">
                <button
                  onClick={() => {
                    setModalType("user");
                    setShowModal(true);
                  }}
                  className="action-btn add-user"
                >
                  <span>👤</span>
                  ADD NEW USER
                </button>
                <button
                  onClick={() => {
                    setModalType("store");
                    setShowModal(true);
                  }}
                  className="action-btn add-store"
                >
                  <span>🏪</span>
                  ADD NEW STORE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            {/* Users Header and Add Button */}
            <div className="management-section">
              <div className="management-header">
                <h3 className="management-title">Users Management</h3>
                <button
                  onClick={() => {
                    setModalType("user");
                    setShowModal(true);
                  }}
                  className="add-btn user"
                >
                  <span>👤</span>
                  ADD NEW USER
                </button>
              </div>

              {/* Filters */}
              <div className="filters-grid">
                <div className="filter-group">
                  <label>NAME</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Filter by name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label>EMAIL</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Filter by email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label>ADDRESS</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Filter by address"
                    value={filters.address}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label>ROLE</label>
                  <select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
                  </select>
                </div>
              </div>

              <div className="filters-actions">
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="management-section">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner" />
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="empty-container">
                  <div className="empty-icon">👥</div>
                  <p className="empty-text">
                    No users found matching your criteria
                  </p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead className="table-header">
                      <tr>
                        <th onClick={() => handleSort("name")}>
                          NAME{" "}
                          {filters.sortBy === "name" &&
                            (filters.sortOrder === "ASC" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("email")}>
                          EMAIL{" "}
                          {filters.sortBy === "email" &&
                            (filters.sortOrder === "ASC" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("address")}>
                          ADDRESS{" "}
                          {filters.sortBy === "address" &&
                            (filters.sortOrder === "ASC" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("role")}>
                          ROLE{" "}
                          {filters.sortBy === "role" &&
                            (filters.sortOrder === "ASC" ? "↑" : "↓")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="table-row">
                          <td className="table-cell name">{user.name}</td>
                          <td className="table-cell secondary">{user.email}</td>
                          <td className="table-cell secondary">
                            {user.address}
                          </td>
                          <td className="table-cell">
                            <span
                              className={`role-badge ${
                                user.role === "admin"
                                  ? "admin"
                                  : user.role === "store_owner"
                                  ? "store-owner"
                                  : "user"
                              }`}
                            >
                              {user.role.replace("_", " ").toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === "stores" && (
          <div>
            {/* Stores Header and Add Button */}
            <div className="management-section">
              <div className="management-header">
                <h3 className="management-title">Stores Management</h3>
                <button
                  onClick={() => {
                    setModalType("store");
                    setShowModal(true);
                  }}
                  className="add-btn store"
                >
                  <span>🏪</span>
                  ADD NEW STORE
                </button>
              </div>

              {/* Filters */}
              <div className="filters-grid">
                <div className="filter-group">
                  <label>STORE NAME</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Filter by store name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label>EMAIL</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Filter by email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label>ADDRESS</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Filter by address"
                    value={filters.address}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
              </div>

              <div className="filters-actions">
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Stores Table */}
            <div className="management-section">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner" />
                  Loading stores...
                </div>
              ) : stores.length === 0 ? (
                <div className="empty-container">
                  <div className="empty-icon">🏪</div>
                  <p className="empty-text">
                    No stores found matching your criteria
                  </p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead className="table-header">
                      <tr>
                        <th onClick={() => handleSort("name")}>
                          NAME{" "}
                          {filters.sortBy === "name" &&
                            (filters.sortOrder === "ASC" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("email")}>
                          EMAIL{" "}
                          {filters.sortBy === "email" &&
                            (filters.sortOrder === "ASC" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("address")}>
                          ADDRESS{" "}
                          {filters.sortBy === "address" &&
                            (filters.sortOrder === "ASC" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("rating")}>
                          RATING{" "}
                          {filters.sortBy === "rating" &&
                            (filters.sortOrder === "ASC" ? "↑" : "↓")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store) => (
                        <tr key={store.id} className="table-row">
                          <td className="table-cell name">{store.name}</td>
                          <td className="table-cell secondary">
                            {store.email}
                          </td>
                          <td className="table-cell secondary">
                            {store.address}
                          </td>
                          <td className="table-cell">
                            {store.rating &&
                            !isNaN(parseFloat(store.rating)) ? (
                              <div className="rating-display">
                                <div className="rating-stars">
                                  {"★".repeat(
                                    Math.round(parseFloat(store.rating))
                                  )}
                                  {"☆".repeat(
                                    5 - Math.round(parseFloat(store.rating))
                                  )}
                                </div>
                                <span className="rating-value">
                                  ({parseFloat(store.rating).toFixed(1)})
                                </span>
                              </div>
                            ) : (
                              <span className="no-rating">No ratings yet</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Adding User/Store */}
        {showModal && (
          <AddModal
            type={modalType}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              loadStats();
              if (activeTab === "users") loadUsers();
              if (activeTab === "stores") loadStores();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Enhanced Modal Component for Adding User/Store
const AddModal = ({ type, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
    ownerEmail: "",
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

    // Name validation (20-60 characters as per PDF)
    if (
      !formData.name ||
      formData.name.length < 20 ||
      formData.name.length > 60
    ) {
      newErrors.name = "Name must be between 20 and 60 characters";
    }

    // Email validation
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    // Password validation (only for users)
    if (type === "user") {
      if (
        !formData.password ||
        formData.password.length < 8 ||
        formData.password.length > 16
      ) {
        newErrors.password = "Password must be between 8 and 16 characters";
      } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter and one special character";
      }
    }

    // Address validation (max 400 characters)
    if (!formData.address || formData.address.length > 400) {
      newErrors.address =
        "Address is required and must be less than 400 characters";
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
      if (type === "user") {
        await apiService.admin.addUser(formData);
        alert("User added successfully!");
      } else {
        await apiService.admin.addStore(formData);
        alert("Store added successfully!");
      }
      onSuccess();
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || `Failed to add ${type}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {type === "user" ? "👤" : "🏪"}
            Add New {type === "user" ? "User" : "Store"}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="modal-form-group">
            <label className="modal-label">
              {type === "user" ? "FULL NAME" : "STORE NAME"} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={`Enter ${
                type === "user" ? "full name" : "store name"
              } (20-60 characters)`}
              className={`modal-input ${errors.name ? "error" : ""}`}
              required
            />
            {errors.name && <div className="modal-error">{errors.name}</div>}
          </div>

          {/* Email Field */}
          <div className="modal-form-group">
            <label className="modal-label">EMAIL ADDRESS *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={`modal-input ${errors.email ? "error" : ""}`}
              required
            />
            {errors.email && <div className="modal-error">{errors.email}</div>}
          </div>

          {/* Password and Role fields (only for users) */}
          {type === "user" && (
            <>
              <div className="modal-form-group">
                <label className="modal-label">PASSWORD *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8-16 chars, 1 uppercase + 1 special character"
                  className={`modal-input ${errors.password ? "error" : ""}`}
                  required
                />
                {errors.password && (
                  <div className="modal-error">{errors.password}</div>
                )}
              </div>

              <div className="modal-form-group">
                <label className="modal-label">USER ROLE *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="modal-select"
                >
                  <option value="user">Normal User</option>
                  <option value="admin">System Administrator</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
            </>
          )}

          {/* Address Field */}
          <div className="modal-form-group">
            <label className="modal-label">ADDRESS *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address (max 400 characters)"
              rows="3"
              className={`modal-textarea ${errors.address ? "error" : ""}`}
              required
            />
            <div className="character-count">
              {formData.address.length}/400 characters
            </div>
            {errors.address && (
              <div className="modal-error">{errors.address}</div>
            )}
          </div>

          {/* Owner Email field (only for stores) */}
          {type === "store" && (
            <div className="modal-form-group">
              <label className="modal-label">
                STORE OWNER EMAIL (OPTIONAL)
              </label>
              <input
                type="email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="Email of existing user to assign as store owner"
                className="modal-input"
              />
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="modal-general-error">{errors.general}</div>
          )}

          {/* Form Buttons */}
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
              className={`modal-btn submit ${type}`}
            >
              {loading ? (
                <>
                  <div className="loading-btn-spinner" />
                  Adding...
                </>
              ) : (
                <>
                  {type === "user" ? "👤" : "🏪"}
                  Add {type === "user" ? "User" : "Store"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
