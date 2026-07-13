import { handleGetAllBacklogs } from "../controller/backlogController.js";
import express from 'express';

const route = express.Router();

route.get("/track-items", handleGetAllBacklogs);

export default route;