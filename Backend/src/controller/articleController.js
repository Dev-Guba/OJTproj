import { success } from "zod";
import { getArticle,createArticle } from "../services/articleServices.js";

export async function handleGetArticle(req, res){
    try {
        const article = await getArticle();
        return res.status(200).json({
            success: true,
            message: "Successfully fetch the data",
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export async function createArticleController(req, res) {
    try {
        const article = await createArticle(req.body);
        return res.status(201).json({
            success: true,
            article
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

}