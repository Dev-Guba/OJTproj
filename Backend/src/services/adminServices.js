import { Op } from "sequelize";
import Employee from "../models/employee.model.js";
import Office from "../models/office.model.js";
import bcrypt from "bcrypt";
import { ROLES } from "../constants/roles.js";

/**
 * =====================================
 * FIND EMPLOYEE BY EMAIL
 * =====================================
 */
export async function findEmployeeByEmail(email, { includeOffice = true } = {}) {
  return await Employee.findOne({
    where: { Email: email },
    attributes: [
      "EmployeeId",
      "EmployeeNo",
      "Email",
      "Password",
      "role_id",
      "SameDeptCode",
      "FirstName",
      "LastName",
    ],
    include: includeOffice
      ? [
          {
            model: Office,
            attributes: ["office_id", "code", "name"],
          },
        ]
      : [],
  });
}

/**
 * =====================================
 * VERIFY LOGIN
 * =====================================
 */
export async function verifyLogin(email, password) {
  const employee = await findEmployeeByEmail(email);

  if (!employee) return null;

  const isValid = await bcrypt.compare(password, employee.Password);

  if (!isValid) return null;

  return {
    EmployeeId: employee.EmployeeId,
    EmployeeNo: employee.EmployeeNo,
    Email: employee.Email,
    role_id: employee.role_id,
    SameDeptCode: employee.SameDeptCode,
    FirstName: employee.FirstName,
    LastName: employee.LastName,
  };
}

export async function findAdminById(id) {
  return await Employee.findOne({
    where: {
      EmployeeId: id,
      role_id: {
        [Op.in]: [1, 2],
      },
    },
    attributes: [
      "EmployeeId",
      "Email",
      "Password",
      "role_id",
      "SameDeptCode",
      "FirstName",
      "LastName",
    ],
    raw: true,
  });
}

export async function getAdmins(filters = {}) {
  const search = String(filters.search ?? "").trim();

  const where = {
    role_id: {
      [Op.in]: [1, 2],
    },
  };

  if (filters.office && filters.office !== "All") {
    where.SameDeptCode = filters.office;
  }

  if (search) {
    where[Op.or] = [
      { Email: { [Op.like]: `%${search}%` } },
      { EmployeeNo: { [Op.like]: `%${search}%` } },
      { SameDeptCode: { [Op.like]: `%${search}%` } },
    ];
  }

  return await Employee.findAll({
    where,
    attributes: [
      "EmployeeId",
      "EmployeeNo",
      "Email",
      "Password",
      "SameDeptCode",
      "role_id",
      "FirstName",
      "LastName",
    ],
    order: [["EmployeeId", "ASC"]],
    raw: true,
  });
}


// function generateAdminEmployeeNo() {
//   const rand = Math.floor(10 + Math.random() * 90);
//   return `ADM-${Date.now()}${rand}`;
// }

export async function createAdminUser({
  employeeId,
  email,
  password,
  SameDeptCode,
}) {
  // Find the selected employee
  const employee = await Employee.findByPk(employeeId);

  if (!employee) {
    throw new Error("Employee not found.");
  }

  // Prevent promoting an existing admin
  if (employee.role_id === ROLES.ADMIN) {
    throw new Error("Employee is already an admin.");
  }

  // Check if email is already used by another employee
  const existing = await Employee.findOne({
    where: {
      Email: email,
      EmployeeId: {
        [Op.ne]: employeeId,
      },
    },
  });

  if (existing) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the existing employee instead of creating a new one
  await employee.update({
    Email: email.trim(),
    Password: hashedPassword,
    SameDeptCode,
    role_id: ROLES.ADMIN,
  });

  return employee;
}


export async function updateAdminUser(userId, data) {
  const admin = await Employee.findOne({
    where: {
      EmployeeId: userId,
      role_id: 2,
    },
  });

  if (!admin) return null;

  const payload = {};

  if (data.email) {
    payload.Email = data.email.trim();
  }

  if (data.employeeNo !== undefined) {
    payload.EmployeeNo = String(data.employeeNo).trim();
  }

  if (data.firstName !== undefined) {
  payload.FirstName = String(data.firstName).trim();
}

if (data.lastName !== undefined) {
  payload.LastName = String(data.lastName).trim();
}

  if (data.SameDeptCode) {
    payload.SameDeptCode = data.SameDeptCode.trim().toUpperCase();
  }

  if (data.password) {
    payload.Password = await bcrypt.hash(data.password, 10);
  }

  await admin.update(payload);

  return admin;
}

export async function deleteAdminUser(userId) { 
  const admin = await Employee.findOne({
    where: {
      EmployeeId: userId,
      role_id: 2,
    },
  });

  if (!admin) return null;

  await admin.destroy();
  return true;
}

export async function createUserByAdmin(currentUser, data) {
  const { email, password, role_id, EmployeeNo, SameDeptCode } = data;

  if (!currentUser || !currentUser.role_id) {
    throw new Error("Unauthorized");
  }

  if (currentUser.role_id === ROLES.ADMIN && role_id !== ROLES.EMPLOYEE) {
    throw new Error("Admin can only create Employee accounts");
  }

  if (currentUser.role_id === ROLES.EMPLOYEE) {
    throw new Error("Employees cannot create accounts");
  }

  if (![ROLES.ADMIN, ROLES.EMPLOYEE].includes(role_id)) {
    throw new Error("Invalid role assignment");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email: email.trim(),
    password: hashedPassword,
    role_id,
    EmployeeNo: EmployeeNo || null,
    SameDeptCode: SameDeptCode || null,
  });

  return newUser;
}

export async function findOfficeByCode(code) {
  if (!code) return null;
  return await Office.findOne({ where: { code } });
}