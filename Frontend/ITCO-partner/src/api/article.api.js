import Http from "./http.js";

const articleAPI = {
    fetchArticle: () => {
        return Http.get("/items/article");
    }
};

export default articleAPI;