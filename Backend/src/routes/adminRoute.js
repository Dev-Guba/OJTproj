import express from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controller/adminController.js";
import { validate } from "../middleware/validate.js";
import { adminLoginSchema } from "../validation/admin.validation.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." },
});

router.post("/auth/login", loginLimiter, validate(adminLoginSchema), login);

export default router;