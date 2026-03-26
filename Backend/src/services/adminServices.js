import { Op } from "sequelize";
import { User, Employee } from "../models/index.js";
import { ROLES } from "../constants/roles.js";
import bcrypt from "bcrypt";

export async function findAdminById(id) {
  return await User.findOne({
    where: {
      user_id: id,
      role_id: {
        [Op.in]: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE],
      },
    },
    attributes: [
      "user_id",
      "email",
      "password",
      "EmployeeId",
      "EmployeeNo",
      "SameDeptCode",
      "role_id",
    ],
    include: [
      {
        model: Employee,
        required: false,
        where: {
          ...(User.rawAttributes.EmployeeId
            ? {}
            : {}),
        },
        attributes: [
          "EmployeeId",
          "EmployeeNo",
          "SameDeptCode",
          "FirstName",
          "LastName",
        ],
      },
    ],
  });
}

export async function findAdminByEmail(email) {
  const user = await User.findOne({
    where: {
      email,
      role_id: {
        [Op.in]: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE],
      },
    },
    attributes: [
      "user_id",
      "email",
      "password",
      "EmployeeId",
      "EmployeeNo",
      "SameDeptCode",
      "role_id",
    ],
    raw: true,
  });

  if (!user) return null;

  let employee = null;

  if (user.EmployeeId) {
    employee = await Employee.findOne({
      where: { EmployeeId: user.EmployeeId },
      attributes: [
        "EmployeeId",
        "EmployeeNo",
        "SameDeptCode",
        "FirstName",
        "LastName",
      ],
      raw: true,
    });
  } else if (user.EmployeeNo) {
    employee = await Employee.findOne({
      where: { EmployeeNo: user.EmployeeNo },
      attributes: [
        "EmployeeId",
        "EmployeeNo",
        "SameDeptCode",
        "FirstName",
        "LastName",
      ],
      raw: true,
    });
  }

  return {
    ...user,
    Employee: employee || null,
  };
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

  const admins = await User.findAll({
    where,
    attributes: [
      "user_id",
      "email",
      "EmployeeId",
      "EmployeeNo",
      "SameDeptCode",
      "role_id",
    ],
    order: [["user_id", "ASC"]],
    raw: true,
  });

  const employeeIds = admins.map((a) => a.EmployeeId).filter(Boolean);

  let employees = [];
  if (employeeIds.length > 0) {
    employees = await Employee.findAll({
      where: {
        EmployeeId: {
          [Op.in]: employeeIds,
        },
      },
      attributes: [
        "EmployeeId",
        "EmployeeNo",
        "SameDeptCode",
        "FirstName",
        "LastName",
      ],
      raw: true,
    });
  }

  const employeeMap = new Map(
    employees.map((e) => [e.EmployeeId, e])
  );

  return admins.map((admin) => ({
    ...admin,
    Employee: admin.EmployeeId ? employeeMap.get(admin.EmployeeId) || null : null,
  }));
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

  // ✅ Update email
  if (data.email != null) {
    payload.email = String(data.email).trim();
  }

  // ✅ Update office
  if (data.SameDeptCode != null) {
    payload.SameDeptCode = String(data.SameDeptCode)
      .trim()
      .toUpperCase();
  }

  // ✅ Update password (IMPORTANT)
  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    payload.password = hashedPassword;
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