import { Op } from "sequelize";
import bcrypt from "bcrypt";
import Employees from "../models/employee.model.js";
import User from "../models/user.model.js";
import { ROLES } from "../constants/roles.js";

export async function getEmployeesByDept(
  deptCode = null,
  page = 1,
  limit = 10,
  options = {}
) {
  const offset = (page - 1) * limit;
  const availableOnly = options.availableOnly === true;
  const search = String(options.search ?? "").trim();

  const whereClause = {
    DateFinish: null,
    SeparationType: null,
  };

  if (deptCode) {
    whereClause.SameDeptCode = deptCode;
  }

  if (search) {
    whereClause[Op.or] = [
      { EmployeeNo: { [Op.like]: `%${search}%` } },
      { FirstName: { [Op.like]: `%${search}%` } },
      { LastName: { [Op.like]: `%${search}%` } },
      { Email: { [Op.like]: `%${search}%` } },
      { SameDeptCode: { [Op.like]: `%${search}%` } },
    ];
  }

  if (availableOnly) {
    const usedEmployeeNos = await User.findAll({
      attributes: ["EmployeeNo"],
      where: {
        EmployeeNo: {
          [Op.ne]: null,
        },
      },
      raw: true,
    });

    const used = usedEmployeeNos.map((x) => x.EmployeeNo).filter(Boolean);

    if (used.length > 0) {
      whereClause.EmployeeNo = {
        ...(whereClause.EmployeeNo || {}),
        [Op.notIn]: used,
      };
    }
  }

  const { count, rows } = await Employees.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [["LastName", "ASC"], ["FirstName", "ASC"]],
  });

  return {
    page,
    limit,
    total: count,
    employees: rows,
  };
}

export async function createEmployeeAccount(data) {
  const { EmployeeNo, email, password, callerRole, callerDeptCode} = data;

  const employee = await Employees.findOne({
    where: {
      EmployeeNo,
      DateFinish: null,
      SeparationType: null,
    },
  });

  if (!employee) {
    return { error: "Employee not found" };
  }

  if (
  callerRole === ROLES.ADMIN &&
  employee.SameDeptCode !== callerDeptCode
) {
  return {
    error: "You can only create accounts for employees in your office",
  };
}
  const existingByEmployee = await User.findOne({
    where: { EmployeeNo },
  });

  if (existingByEmployee) {
    return { error: "This employee already has an account" };
  }

  const existingByEmail = await User.findOne({
    where: { email },
  });

  if (existingByEmail) {
    return { error: "Email is already in use" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const created = await User.create({
    email: String(email).trim(),
    password: hashedPassword,
    EmployeeNo: employee.EmployeeNo,
    SameDeptCode: employee.SameDeptCode ?? null,
    role_id: ROLES.EMPLOYEE,
  });

  return {
    data: {
      user_id: created.user_id,
      email: created.email,
      EmployeeNo: created.EmployeeNo,
      SameDeptCode: created.SameDeptCode,
      role_id: created.role_id,
    },
  };
}

export async function createFullEmployee({ email, password, SameDeptCode }) {
  // Check email not already taken in CPTUsers
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return { error: "Email is already in use" };

  // Generate next EmployeeNo automatically
  const last = await Employees.findOne({
    order: [["EmployeeId", "DESC"]],
  });

  // Simple increment — adjust prefix to match your format e.g. EMP001
  const lastNo = last?.EmployeeNo?.replace(/\D/g, "") ?? "0";
  const nextNo = "EMP" + String(parseInt(lastNo) + 1).padStart(3, "0");

  // Create the Employee record
  const employee = await Employees.create({
    EmployeeNo: nextNo,
    Email: email,
    SameDeptCode: SameDeptCode,
  });

  // Create the CPTUsers login account
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: String(email).trim(),
    password: hashedPassword,
    EmployeeNo: employee.EmployeeNo,
    SameDeptCode: SameDeptCode,
    role_id: ROLES.EMPLOYEE,
  });

  return {
    data: {
      employee,
      user: { user_id: user.user_id, email: user.email },
    },
  };
}

export async function updateEmployeeAccount({ EmployeeNo, email, password }) {
  const user = await User.findOne({ where: { EmployeeNo } });
  if (!user) return { error: "Account not found" };

  // Check email not taken by someone else
  if (email && email !== user.email) {
    const taken = await User.findOne({ where: { email } });
    if (taken) return { error: "Email is already in use" };
    user.email = email.trim();
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  return { data: { user_id: user.user_id, email: user.email, EmployeeNo } };
}
export async function deleteFullEmployee(EmployeeNo) {
  const employee = await Employees.findOne({ where: { EmployeeNo } });
  if (!employee) return { error: "Employee not found" };

  // Delete CPTUsers account if exists
  await User.destroy({ where: { EmployeeNo } });

  // Delete Employee record
  await employee.destroy();

  return { success: true };
}