import { Op } from "sequelize";
import { User, Employee } from "../models/index.js";
import { ROLES } from "../constants/roles.js";

export async function findAdminById(id) {
  return await User.findOne({
    where: {
      user_id: id,
      role_id: {
        [Op.in]: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
    },
    attributes: [
      "user_id",
      "email",
      "password",
      "EmployeeNo",
      "SameDeptCode",
      "role_id",
    ],
    include: {
      model: Employee,
      attributes: ["EmployeeNo", "SameDeptCode", "FirstName", "LastName"],
      required: false,
    },
  });
}

export async function findAdminByEmployeeNo(employeeNo) {
  return await User.findOne({
    where: { 
      EmployeeNo: employeeNo,
    }
  });
}

export async function checkEmployeeNoIsActive(employeeNo) {
  const employee = await findAdminByEmployeeNo(employeeNo);
  if (!employee) return false;

  const statusId = employee.Employee.statusId;
  return statusId === 1; // Assuming 1 is the active status ID
}

export async function findAdminByEmail(email) {
  return await User.findOne({
    where: {
      email,
      role_id: {
        [Op.in]: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
    },
    attributes: [
      "user_id",
      "email",
      "password",
      "EmployeeNo",
      "SameDeptCode",
      "role_id",
    ],
    include: {
      model: Employee,
      attributes: ["EmployeeNo", "SameDeptCode", "FirstName", "LastName"],
      required: false,
    },
  });
}

export async function getAdminUsers(filters = {}) {
  const search = String(filters.search ?? "").trim();

  const where = {
    role_id: {
      [Op.in]: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    },
  };

  if (filters.office && filters.office !== "All") {
    where.SameDeptCode = filters.office;
  }

  if (search) {
    where[Op.or] = [
      { email: { [Op.like]: `%${search}%` } },
      { EmployeeNo: { [Op.like]: `%${search}%` } },
      { SameDeptCode: { [Op.like]: `%${search}%` } },
    ];
  }

  return await User.findAll({
    where,
    attributes: [
      "user_id",
      "email",
      "EmployeeNo",
      "SameDeptCode",
      "role_id",
    ],
    include: {
      model: Employee,
      attributes: ["EmployeeNo", "SameDeptCode", "FirstName", "LastName"],
      required: false,
    },
    order: [["user_id", "ASC"]],
  });
}

export async function updateAdminUser(userId, data) {
  const admin = await User.findOne({
    where: {
      user_id: userId,
      role_id: ROLES.ADMIN,
    },
  });

  if (!admin) return null;

  const payload = {};

  if (data.email != null) {
    payload.email = String(data.email).trim();
  }

  if (data.SameDeptCode != null) {
    payload.SameDeptCode = String(data.SameDeptCode).trim().toUpperCase();
  }

  await admin.update(payload);
  return admin;
}

export async function deleteAdminUser(userId) {
  const admin = await User.findOne({
    where: {
      user_id: userId,
      role_id: ROLES.ADMIN,
    },
  });

  if (!admin) return null;

  await admin.destroy();
  return true;
}