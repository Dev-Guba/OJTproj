import Http from "./Http";

export const adminApi = {
  createUser: (data) => Http.post("/admin/create-user", data),
};