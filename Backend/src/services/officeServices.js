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

  const admins = await Employee.findAll({
    where: {
      SameDeptCode: office.code,
      role_id: ROLES.ADMIN,
    },
    attributes: ["EmployeeId", "EmployeeNo", "FirstName", "LastName", "Email", "SameDeptCode", "role_id"],
    order: [["LastName", "ASC"]],
    raw: true,
  });

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

  // Accounts live in the User table, linked by EmployeeNo — not on the Employee row itself
  const employeeNos = employees.map((e) => e.EmployeeNo).filter(Boolean);

  // AFTER
const accounts = employeeNos.length
  ? await User.findAll({
      where: { EmployeeNo: { [Op.in]: employeeNos } },
    })
  : [];

  const accountByEmployeeNo = new Map(accounts.map((a) => [a.EmployeeNo, a]));

  const employeesWithAccountStatus = employees.map((emp) => {
    const account = accountByEmployeeNo.get(emp.EmployeeNo);
    return {
      ...emp,
      hasAccount: !!account,
      account: account ? { email: account.email } : null,
    };
  });

  return { office, admins, employees: employeesWithAccountStatus };
}