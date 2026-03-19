import express from "express";
import {
  getEmployees,
  createEmployeeAccountController,
} from "../controller/employeeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getEmployees);
router.post("/accounts", requireAuth, createEmployeeAccountController);

export default router;