import Article  from "../models/article.model.js";

export async function getArticle(){
    const data = await Article.findAll();
    return data;
}