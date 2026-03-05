import Http from "./Http.js";

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.data?.records)) return payload.data.records;
  return [];
};

export const recordsApi = {
  getAll: async () => {
    const res = await Http.get("/records");
    return toArray(res.data); 
  },

  async create(payload) {
    const res = await Http.post("/records", payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await Http.put(`/records/${id}`, payload);
    return res.data;
  },

  async remove(id) {
    const res = await Http.delete(`/records/${id}`);
    return res.data;
  },

  generateReport(payload) {
    return Http.post("/records/report", payload, {
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    });
  },
};

export default recordsApi;