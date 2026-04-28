import { Op } from "sequelize";
import { Office, User, Employee } from "../models/index.js";
import { ROLES } from "../constants/roles.js";

export async function getOffices(filters = {}, user) {
  const search = String(filters.search ?? "").trim();
  const status = String(filters.status ?? "all").trim().toLowerCase();

  const where = {};

  if (status !== "all") {
    where.status = status;
  }

  if (search) {
  where[Op.or] = [
    { code: { [Op.like]: `%${search}%` } },
    { name: { [Op.like]: `%${search}%` } },
    { description: { [Op.like]: `%${search}%` } }, // 👈 add this
  ];
}

  // 🔥 ONLY CHANGE (ROLE RESTRICTION)
  if (user?.role_id === ROLES.ADMIN) {
    where.code = user.SameDeptCode;
  }

  return await Office.findAll({
    where,
    order: [["code", "ASC"]],
  });
}

export async function createOffice(data) {
  return await Office.create({
    code: String(data.code ?? "").trim().toUpperCase(),
    name: String(data.name ?? "").trim(),
    description: data.description ? String(data.description).trim() : null,
    status: String(data.status ?? "active").trim().toLowerCase(),
  });
}

export async function getOfficeById(officeId) {
  return await Office.findByPk(officeId);
}

export async function updateOffice(officeId, data) {
  const office = await Office.findByPk(officeId);
  if (!office) return null;

  return await office.update({
    code: data.code != null ? String(data.code).trim().toUpperCase() : office.code,
    name: data.name != null ? String(data.name).trim() : office.name,
    description: data.description != null ? String(data.description).trim() : office.description,
    status: data.status != null ? String(data.status).trim().toLowerCase() : office.status,
  });
}

export async function deleteOffice(officeId) {
  const office = await Office.findByPk(officeId);
  if (!office) return null;

  await office.destroy();
  return true;
}

export async function getOfficeDetails(officeId) {
  const office = await Office.findByPk(officeId);
  if (!office) return null;

  // Admins = employees with admin role_id in this office
  const admins = await Employee.findAll({
    where: {
      SameDeptCode: office.code,
      role_id: ROLES.ADMIN,
    },
    attributes: ["EmployeeId", "EmployeeNo", "FirstName", "LastName", "Email", "SameDeptCode", "role_id"],
    order: [["LastName", "ASC"]],
    raw: true,
  });

  // Employees = active employees in this office
  const employees = await Employee.findAll({
    where: {
      SameDeptCode: office.code,
      DateFinish: null,
      SeparationType: null,
    },
    attributes: ["EmployeeId", "EmployeeNo", "FirstName", "LastName", "Email", "SameDeptCode", "role_id"],
    order: [["LastName", "ASC"], ["FirstName", "ASC"]],
    raw: true,
  });

  const employeesWithAccountStatus = employees.map((emp) => ({
    ...emp,
    hasAccount: !!emp.Email && !!emp.Password, // or whatever signals an account exists
  }));

  return {
    office,
    admins,
    employees: employeesWithAccountStatus,
  };
}