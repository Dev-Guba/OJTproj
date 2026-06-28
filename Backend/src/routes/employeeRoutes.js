import express from "express";
import {
  getEmployees,
  createEmployeeAccountController,
  createFullEmployeeController,
  updateEmployeeAccountController,
  deleteEmployeeController, 
} from "../controller/employeeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getEmployees);
router.post("/accounts", requireAuth, createEmployeeAccountController);
router.post("/create", requireAuth, createFullEmployeeController);
router.put("/accounts/:EmployeeNo", requireAuth, updateEmployeeAccountController);
router.delete("/:EmployeeNo", requireAuth, deleteEmployeeController);

export default router;
