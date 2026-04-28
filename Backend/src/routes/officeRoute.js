import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  getAllOffices,
  createOfficeController,
  updateOfficeController,
  deleteOfficeController,
  getOfficeDetailsController,
  getMyOfficeController,
} from "../controller/officeController.js";
import {
  createOfficeSchema,
  updateOfficeSchema,
} from "../validation/office.validation.js";

const router = express.Router();

router.get("/", requireAuth, getAllOffices);
router.get("/me", requireAuth, getMyOfficeController);
router.get("/:id/details", requireAuth, getOfficeDetailsController);


router.post("/", requireAuth, validate(createOfficeSchema), createOfficeController);
router.put("/:id", requireAuth, validate(updateOfficeSchema), updateOfficeController);
router.delete("/:id", requireAuth, deleteOfficeController);

export default router;