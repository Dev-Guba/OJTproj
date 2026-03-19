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
      role_id: {
        [Op.in]: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
    },
    attributes: ["user_id", "email", "SameDeptCode", "EmployeeNo", "role_id"],
    include: {
      model: Employee,
      attributes: ["EmployeeNo", "FirstName", "LastName", "SameDeptCode"],
      required: false,
    },
    order: [["user_id", "ASC"]],
  });

  const employees = await Employee.findAll({
    where: {
      SameDeptCode: office.code,
      DateFinish: null,
      SeparationType: null,
    },
    attributes: ["EmployeeNo", "FirstName", "LastName", "Email", "SameDeptCode"],
    order: [["LastName", "ASC"], ["FirstName", "ASC"]],
  });

  const employeeNos = employees.map((emp) => emp.EmployeeNo).filter(Boolean);

  let employeeAccounts = [];
  if (employeeNos.length > 0) {
    employeeAccounts = await User.findAll({
      where: {
        EmployeeNo: {
          [Op.in]: employeeNos,
        },
      },
      attributes: ["user_id", "email", "EmployeeNo", "role_id"],
      raw: true,
    });
  }

  const accountMap = new Map(
    employeeAccounts.map((acc) => [acc.EmployeeNo, acc])
  );

  const employeesWithAccountStatus = employees.map((emp) => {
    const plain = emp.toJSON();
    const linkedAccount = accountMap.get(emp.EmployeeNo);

    return {
      ...plain,
      hasAccount: !!linkedAccount,
      account: linkedAccount || null,
    };
  });

  return {
    office,
    admins,
    employees: employeesWithAccountStatus,
  };
}