import express from "express";
import {
  getEmployees,
  createEmployeeAccountController,
  createEmployeeController,
  updateEmployeeAccountController,
  deleteEmployeeController,
} from "../controller/employeeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getEmployees);
router.post("/accounts", requireAuth, createEmployeeAccountController);
router.post("/create", requireAuth, createEmployeeController);
router.put("/accounts/:EmployeeNo", requireAuth, updateEmployeeAccountController);
router.delete("/:EmployeeNo", requireAuth, deleteEmployeeController);

export default router;