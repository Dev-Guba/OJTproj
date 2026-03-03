import express from "express";
import { requireAuth, requireRole} from "../middleware/authMiddleware.js";

import {
  handleCreateRecords,
  handleDeleteRecords,
  handleRecords,
  handleUpdateRecords,
  handleGetRecordID,
} from "../controller/recordController.js";

import {
  generateRecordsReportPdf
} from "../services/recordServices.js"

import  verifyToken  from "../middleware/verifyToken.js";

import { validate } from "../middleware/validate.js";
import {
  recordCreateSchema,
  recordUpdateSchema,
  recordIdParamSchema,
} from "../validation/record.validation.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(1)); // ✅ admin-only

router.get("/", handleRecords);
router.post("/report", generateRecordsReportPdf);
router.get("/:id", validate(recordIdParamSchema), handleGetRecordID);
router.post("/create", validate(recordCreateSchema), handleCreateRecords);
router.put("/:id", validate(recordUpdateSchema), handleUpdateRecords);
router.delete("/:id", validate(recordIdParamSchema), handleDeleteRecords);

export default router;