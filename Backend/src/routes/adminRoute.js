import express from "express";
import { login } from "../controller/adminController.js";
import { validate } from "../middleware/validate.js";
import { adminLoginSchema } from "../validation/admin.validation.js";

const router = express.Router();

router.post("/auth/login", validate(adminLoginSchema), login);

export default router;