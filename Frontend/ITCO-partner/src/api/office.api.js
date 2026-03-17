import Http from "./Http.js";

const officeApi = {
  getAll: (params = {}) => {
    return Http.get("/offices", { params });
  },

  getDetails: (id) => {
    return Http.get(`/offices/${id}/details`);
  },

  create: (data) => {
    return Http.post("/offices", data);
  },

  update: (id, data) => {
    return Http.put(`/offices/${id}`, data);
  },

  remove: (id) => {
    return Http.delete(`/offices/${id}`);
  },
};

export default officeApi;
