import Http from "./http.js";

const Api = {
  AdminLoginAPI: (data) => Http.post("/admin/auth/login", data),
};

export default Api;