import Http from "./Http";

export const backlogApi = {
  async getAll() {
    const res = await Http.get("/logs/track-items");
    return res.data;
  },
};

export default backlogApi;