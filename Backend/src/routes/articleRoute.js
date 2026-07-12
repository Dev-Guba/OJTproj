import express from 'express';
import { handleGetArticle } from '../controller/articleController.js';

const route = express.Router();

route.get("/article", handleGetArticle);

export default route;