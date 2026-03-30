import express from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controller/adminController.js";
import { getEmployees } from "../controller/employeeController.js";
import { validate } from "../middleware/validate.js";
import {
  adminLoginSchema,
  createAdminSchema,
} from "../validation/admin.validation.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." },
});

router.post("/auth/login", loginLimiter, validate(adminLoginSchema), login);

router.get("/admins", requireAuth, getAdmins);
router.post("/admins", requireAuth, validate(createAdminSchema), createAdmin);
router.put("/admins/:id", requireAuth, updateAdmin);
router.delete("/admins/:id", requireAuth, deleteAdmin);

router.get("/employees", requireAuth, getEmployees);

export default router;