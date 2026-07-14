import Http from "./Http";

const backlogApi  = {
   getAll() {
    return Http.get("/logs/track-items");
  },
};

export default backlogApi;