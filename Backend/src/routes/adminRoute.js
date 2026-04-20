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
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// -------------------------
// Rate limiter for login
// -------------------------
const loginLimiter = rateLimit({
  windowMs: 1 * 1 * 1, 
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." },
});

// -------------------------
// Auth routes (/admin/auth/*)
// -------------------------
router.post("/auth/login", loginLimiter, validate(adminLoginSchema), login);

router.get("/admins", requireAuth, HandlegetAdmins);
router.post("/admins", requireAuth, validate(createAdminSchema), HandleCreateAdmin);
router.put("/admins/:id", requireAuth, HandleUpdateAdmin);
router.delete("/admins/:id", requireAuth, HandleDeleteAdmin);

// -------------------------
// Employee routes accessible by admin
// -------------------------
router.get("/employees", requireAuth, getEmployees);

router.post("/create-user", verifyToken, HandleCreateAdmin);

export default router;