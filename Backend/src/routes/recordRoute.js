import express from "express";
import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../controller/recordController.js";

const router = express.Router();

router.get("/", getAllRecords);
router.get("/:id", getRecordById);
router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;