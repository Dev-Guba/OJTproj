import Http from "./http";

export const recordsApi = {
  async getAll() {
    const res = await Http.get("/records");
    return res.data;
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

  // ✅ PDF report (Puppeteer)
  // returns the full axios response (needed for headers + blob)
  generateReport(payload) {
    return Http.post("/records/report", payload, {
      responseType: "blob", // ✅ important for PDF
      headers: {
        Accept: "application/pdf",
      },
    });
  },
};
