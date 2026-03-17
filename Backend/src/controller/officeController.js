import {
  getOffices,
  createOffice,
  updateOffice,
  deleteOffice,
  getOfficeDetails,
} from "../services/officeServices.js";

import { ROLES } from "../constants/roles.js";

export async function getAllOffices(req, res) {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "all";

    const offices = await getOffices({ search, status });

    return res.status(200).json({
      success: true,
      data: offices,
    });
  } catch (err) {
    console.error("Get offices error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function createOfficeController(req, res) {
  try {
    if (req.user.role_id !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { code, name, status } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: "Code and name are required",
      });
    }

    const office = await createOffice({ code, name, status });

    return res.status(201).json({
      success: true,
      message: "Office created successfully",
      data: office,
    });
  } catch (err) {
    console.error("Create office error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function updateOfficeController(req, res) {
  try {
    if (req.user.role_id !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;

    const updated = await updateOffice(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Office updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update office error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function deleteOfficeController(req, res) {
  try {
    if (req.user.role_id !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;

    const deleted = await deleteOffice(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Office deleted successfully",
    });
  } catch (err) {
    console.error("Delete office error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function getOfficeDetailsController(req, res) {
  try {
    const { id } = req.params;

    const details = await getOfficeDetails(id);

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: details,
    });
  } catch (err) {
    console.error("Get office details error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}