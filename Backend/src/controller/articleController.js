import { success } from "zod";
import { getArticle } from "../services/articleServices.js";

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