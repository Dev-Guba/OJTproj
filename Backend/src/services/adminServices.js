import { Op } from "sequelize";
import Employee from "../models/employee.model.js";
import Office from "../models/office.model.js";
import bcrypt from "bcrypt";

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

/**
 * =====================================
 * FIND ADMIN BY ID
 * =====================================
 */
export async function findAdminById(id) {
  return await Employee.findOne({
    where: {
      EmployeeId: id,
      role_id: {
        [Op.in]: [1, 2], // SUPER_ADMIN, ADMIN
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

/**
 * =====================================
 * GET ADMINS LIST
 * =====================================
 */
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

/**
 * =====================================
 * CREATE ADMIN
 * =====================================
 */
export async function createAdminUser({ email, password, SameDeptCode }) {
  const existing = await Employee.findOne({
    where: { Email: email },
  });

  if (existing) return null;

  const hashedPassword = await bcrypt.hash(password, 10);

  return await Employee.create({
    Email: email,
    Password: hashedPassword,
    SameDeptCode,
    role_id: 2,
  });
}

/**
 * =====================================
 * UPDATE ADMIN
 * =====================================
 */
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

  if (data.SameDeptCode) {
    payload.SameDeptCode = data.SameDeptCode.trim().toUpperCase();
  }

  if (data.password) {
    payload.Password = await bcrypt.hash(data.password, 10);
  }

  await admin.update(payload);

  return admin;
}

/**
 * =====================================
 * DELETE ADMIN
 * =====================================
 */
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

  // 🔒 1. Validate creator role
  if (!currentUser || !currentUser.role_id) {
    throw new Error("Unauthorized");
  }

  // 🔒 2. Role restriction logic
  if (currentUser.role_id === ROLES.ADMIN && role_id !== ROLES.EMPLOYEE) {
    throw new Error("Admin can only create Employee accounts");
  }

  if (currentUser.role_id === ROLES.EMPLOYEE) {
    throw new Error("Employees cannot create accounts");
  }

  // 🔒 3. Prevent invalid roles
  if (![ROLES.ADMIN, ROLES.EMPLOYEE].includes(role_id)) {
    throw new Error("Invalid role assignment");
  }

  // 🔒 4. Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // 🔒 5. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 🔒 6. Create user
  const newUser = await User.create({
    email: email.trim(),
    password: hashedPassword,
    role_id,
    EmployeeNo: EmployeeNo || null,
    SameDeptCode: SameDeptCode || null,
  });

  return newUser;
}