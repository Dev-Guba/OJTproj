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