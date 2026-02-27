import express from "express";
import { requireAuth, requireRole} from "../middleware/authMiddleware.js";

import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  generateRecordsReportPdf,
} from "../controller/recordController.js";

import { verifyToken } from "../middleware/verifyToken.js";

import { validate } from "../middleware/validate.js";
import {
  recordCreateSchema,
  recordUpdateSchema,
  recordIdParamSchema,
} from "../validation/record.validation.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(1)); // ✅ admin-only

router.get("/", verifyToken, getAllRecords);
router.post("/report", generateRecordsReportPdf);
router.get("/:id", validate(recordIdParamSchema), getRecordById);
router.post("/", validate(recordCreateSchema), createRecord);
router.put("/:id", validate(recordUpdateSchema), updateRecord);
router.delete("/:id", validate(recordIdParamSchema), deleteRecord);

export default router;