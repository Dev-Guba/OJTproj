import Http from "./Http.js";

const Api = {
  AdminLoginAPI: (data) => {
    return Http.post("/admin/auth/login", data);
  },

  getAdmins: (params = {}) => {
    return Http.get("/admin/admins", { params });
  },

  createAdmin: (data) => {
    return Http.post("/admin/admins", data);
  },

  updateAdmin: (id, data) => {
    return Http.put(`/admin/admins/${id}`, data);
  },

  deleteAdmin: (id) => {
    return Http.delete(`/admin/admins/${id}`);
  },

  getAvailableEmployees: (params = {}) => {
    return Http.get("/employees", {
      params: {
        availableOnly: true,
        limit: 100,
        ...params,
      },
    });
  },

  getOffices: (params = {}) => {
    return Http.get("/offices", { params });
  },
};



export default Api;