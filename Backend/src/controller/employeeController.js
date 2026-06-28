import {
  getEmployeesByDept,
  createEmployeeAccount,
  createFullEmployee,
  updateEmployeeAccount,
  deleteFullEmployee,
} from "../services/employeeServices.js";
import { ROLES } from "../constants/roles.js";

export async function getEmployees(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const availableOnly = String(req.query.availableOnly).toLowerCase() === "true";
    const search = req.query.search || "";

    const deptCode =
      req.user.role_id === ROLES.ADMIN
        ? req.user.SameDeptCode
        : null;

    const result = await getEmployeesByDept(deptCode, page, limit, {
      availableOnly,
      search,
    });

    res.json(result);
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createEmployeeAccountController(req, res) {
  try {
    const { EmployeeNo, email, password } = req.body;

    if (!EmployeeNo || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "EmployeeNo, email, and password are required",
      });
    }

    const isSuperAdmin = req.user.role_id === ROLES.SUPER_ADMIN;
    const isAdmin = req.user.role_id === ROLES.ADMIN;

    if (!isSuperAdmin && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const result = await createEmployeeAccount({
      EmployeeNo,
      email,
      password,
      callerRole: req.user.role_id,
      callerDeptCode: req.user.SameDeptCode,
    });

    if (result?.error) {
      const code =
        result.error === "Employee not found"
          ? 404
          : result.error === "This employee already has an account" ||
            result.error === "Email is already in use"
          ? 409
          : 400;

      return res.status(code).json({ success: false, message: result.error });
    }

    return res.status(201).json({
      success: true,
      message: "Employee account created successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Create employee account error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function createFullEmployeeController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const isSuperAdmin = req.user.role_id === ROLES.SUPER_ADMIN;
    const isAdmin = req.user.role_id === ROLES.ADMIN;

    if (!isSuperAdmin && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const SameDeptCode = req.user.SameDeptCode;

    const result = await createFullEmployee({ email, password, SameDeptCode });

    if (result?.error) {
      return res.status(409).json({ success: false, message: result.error });
    }

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Create full employee error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateEmployeeAccountController(req, res) {
  try {
    const { EmployeeNo } = req.params;
    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).json({
        success: false,
        message: "Provide at least email or password to update",
      });
    }

    const result = await updateEmployeeAccount({ EmployeeNo, email, password });

    if (result?.error) {
      const code = result.error === "Account not found" ? 404 : 409;
      return res.status(code).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Update employee account error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteEmployeeController(req, res) {
  try {
    const { EmployeeNo } = req.params;

    const isSuperAdmin = req.user.role_id === ROLES.SUPER_ADMIN;
    const isAdmin = req.user.role_id === ROLES.ADMIN;

    if (!isSuperAdmin && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const result = await deleteFullEmployee(EmployeeNo);

    if (result?.error) {
      return res.status(404).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}