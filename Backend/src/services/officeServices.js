import { Op } from "sequelize";
import { Office, User, Employee } from "../models/index.js";
import { ROLES } from "../constants/roles.js";

export async function getOffices(filters = {}) {
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

  return await Office.findAll({
    where,
    order: [["code", "ASC"]],
  });
}

export async function createOffice(data) {
  return await Office.create({
    code: String(data.code ?? "").trim().toUpperCase(),
    name: String(data.name ?? "").trim(),
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
    status:
      data.status != null
        ? String(data.status).trim().toLowerCase()
        : office.status,
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

  const admins = await User.findAll({
    where: {
      SameDeptCode: office.code,
      role_id: ROLES.ADMIN,
    },
    attributes: ["user_id", "email", "EmployeeId", "EmployeeNo", "SameDeptCode", "role_id"],
    order: [["user_id", "ASC"]],
    raw: true,
  });

  const adminEmployeeIds = admins.map((a) => a.EmployeeId).filter(Boolean);

  let adminEmployees = [];
  if (adminEmployeeIds.length > 0) {
    adminEmployees = await Employee.findAll({
      where: {
        EmployeeId: {
          [Op.in]: adminEmployeeIds,
        },
      },
      attributes: ["EmployeeId", "EmployeeNo", "FirstName", "LastName", "SameDeptCode"],
      raw: true,
    });
  }

  const adminEmployeeMap = new Map(
    adminEmployees.map((e) => [e.EmployeeId, e])
  );

  const adminsWithEmployee = admins.map((admin) => ({
    ...admin,
    Employee: admin.EmployeeId ? adminEmployeeMap.get(admin.EmployeeId) || null : null,
  }));

  const employees = await Employee.findAll({
    where: {
      SameDeptCode: office.code,
      DateFinish: null,
      SeparationType: null,
    },
    attributes: ["EmployeeId", "EmployeeNo", "FirstName", "LastName", "Email", "SameDeptCode"],
    order: [["LastName", "ASC"], ["FirstName", "ASC"]],
    raw: true,
  });

  const employeeIds = employees.map((e) => e.EmployeeId).filter(Boolean);

  let employeeAccounts = [];
  if (employeeIds.length > 0) {
    employeeAccounts = await User.findAll({
      where: {
        EmployeeId: {
          [Op.in]: employeeIds,
        },
      },
      attributes: ["user_id", "email", "EmployeeId", "role_id", "SameDeptCode"],
      raw: true,
    });
  }

  const accountMap = new Map(
    employeeAccounts.map((acc) => [acc.EmployeeId, acc])
  );

  const employeesWithAccountStatus = employees.map((emp) => {
    const linkedAccount = accountMap.get(emp.EmployeeId);

    return {
      ...emp,
      hasAccount: !!linkedAccount,
      account: linkedAccount || null,
    };
  });

  return {
    office,
    admins: adminsWithEmployee,
    employees: employeesWithAccountStatus,
  };
}