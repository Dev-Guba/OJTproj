import { Record } from "../models/index.js";

export async function getAllRecords(req, res) {
  try {
    const rows = await Record.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export async function getRecordById(req, res) {
  try {
    const row = await Record.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Record not found" });
    return res.json(row);
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export async function createRecord(req, res) {
  try {
    const created = await Record.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: "Create failed", error: err.message });
  }
}

export async function updateRecord(req, res) {
  try {
    const row = await Record.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Record not found" });

    await row.update(req.body);
    return res.json(row);
  } catch (err) {
    return res.status(400).json({ message: "Update failed", error: err.message });
  }
}

export async function deleteRecord(req, res) {
  try {
    const row = await Record.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Record not found" });

    await row.destroy();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ message: "Delete failed", error: err.message });
  }
}