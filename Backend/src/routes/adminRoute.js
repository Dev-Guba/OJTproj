import express from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  HandlegetAdmins,
  HandleCreateAdmin,
  HandleUpdateAdmin,
  HandleDeleteAdmin,
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

router.get("/admins", requireAuth, HandlegetAdmins);
router.post("/admins", requireAuth, validate(createAdminSchema), HandleCreateAdmin);
router.put("/admins/:id", requireAuth, HandleUpdateAdmin);
router.delete("/admins/:id", requireAuth, HandleDeleteAdmin);

router.get("/employees", requireAuth, getEmployees);

export default router;