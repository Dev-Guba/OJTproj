import Http from "./Http.js";

const employeeApi = {
  getAll: (params = {}) => {
    return Http.get("/employees", { params });
  },

  createAccount: (data) => {
    return Http.post("/employees/accounts", data);
  },
};

export default employeeApi;