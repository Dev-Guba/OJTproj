import express from 'express';
import { handleGetArticle, createArticleController } from '../controller/articleController.js';
import { requireAuth } from "../middleware/authMiddleware.js";

const route = express.Router();

route.get("/article", handleGetArticle);
route.post("/create-article",requireAuth,createArticleController);

export default route;