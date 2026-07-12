import Article  from "../models/article.model.js";

export async function getArticle(){
    const data = await Article.findAll();
    return data;
}

export async function createArticle(data) {

    const result = await Article.create({
        article: data.article,
        description: data.description,
        propNumber: data.propNumber,
        dateAcquired: data.dateAcquired,
        unit: data.unit,
        unitValue: data.unitValue,
        balQty: data.balQty,
        balValue: data.balValue,
    });

    return result;
}