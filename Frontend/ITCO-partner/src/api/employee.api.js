import Http from "./Http.js";

const employeeApi = {
  getAll: (params = {}) => {
    return Http.get("/employees", { params });
  },

  createAccount: (data) => {
    return Http.post("/employees/accounts", data);
  },

    createEmployee: (data) => Http.post("/employees/create", data),
  updateAccount: (EmployeeNo, data) => Http.put(`/employees/accounts/${EmployeeNo}`, data),
  deleteEmployee: (EmployeeNo) => Http.delete(`/employees/${EmployeeNo}`),
};



export default employeeApi;