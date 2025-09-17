import { api } from "./authService";

const apiService = {
  // Admin API calls
  admin: {
    getDashboardStats: () => api.get("/admin/dashboard"),
    addUser: (userData) => api.post("/admin/users", userData),
    addStore: (storeData) => api.post("/admin/stores", storeData),
    getUsers: (params) => api.get("/admin/users", { params }),
    getStores: (params) => api.get("/admin/stores", { params }),
    getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  },

  // Store API calls
  stores: {
    getStores: (params) => api.get("/stores", { params }),
    submitRating: (ratingData) => api.post("/stores/rating", ratingData),
  },

  // Store Owner API calls
  storeOwner: {
    getDashboard: () => api.get("/store-owner/dashboard"),
  },
};

export default apiService;
