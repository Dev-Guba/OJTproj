import Article  from "../models/article.model.js";
import { Op } from "sequelize";

export async function getArticle() {
    return await Article.findAll({
        where: {
            balQty: {
                [Op.gt]: 0
            }
        },
        order: [["article", "ASC"]]
    });
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