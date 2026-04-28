import { Record, Employee } from "../models/index.js";
import puppeteer from "puppeteer";
import { Op } from "sequelize";
import { buildRecordsReportHtml } from "../templates/recordsReport.template.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ROLES } from "../constants/roles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toDataUriPng(absPath) {
  try {
    const buf = fs.readFileSync(absPath);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

function getEmployeeFullName(user) {
  const firstName =
    user?.firstName ??
    user?.FirstName ??
    user?.Employee?.FirstName ??
    "";

  const lastName =
    user?.lastName ??
    user?.LastName ??
    user?.Employee?.LastName ??
    "";

  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function buildRecordScopeWhere(user) {
  if (!user) throw new Error("Authenticated user not found.");

  switch (user.role_id) {
    case ROLES.SUPER_ADMIN:
      return {}; // all records

    case ROLES.ADMIN:
      // If SameDeptCode exists, filter by office
      // Otherwise, return no filter to prevent 403
      return user.SameDeptCode ? { office: user.SameDeptCode } : {};

    case ROLES.EMPLOYEE:
      const fullName = getEmployeeFullName(user);
      if (!fullName) throw new Error("Employee full name is required for record filtering.");
      return { EmployeeNo: user.EmployeeNo };

    default:
      return {};
  }
}

// ----------- CRUD -----------

export async function getAllRecords(user, query = {}) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 8;
  const offset = (page - 1) * limit;
  const search = String(query.search ?? "").trim();

  const allowedSortKeys = [
    "article",
    "description",
    "propNumber",
    "dateAcquired",
    "unit",
    "unitValue",
    "balQty",
    "balValue",
    "areMeNo",
    "office",
    "createdAt",
    "accountableOfficer", // virtual
  ];

  const sortKey = allowedSortKeys.includes(query.sortKey)
    ? query.sortKey
    : "office";

  const sortDir =
    String(query.sortDir).toLowerCase() === "asc" ? "ASC" : "DESC";

  const where = buildRecordScopeWhere(user);

  // 🔍 SEARCH
  if (search) {
    where[Op.and] = [
      ...(where[Op.and] || []),
      {
        [Op.or]: [
          { article: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { propNumber: { [Op.like]: `%${search}%` } },
          { areMeNo: { [Op.like]: `%${search}%` } },
          { office: { [Op.like]: `%${search}%` } },

          // ✅ FULL NAME SEARCH
          sequelizeWhere(
            fn(
              "concat",
              col("Employee.FirstName"),
              " ",
              col("Employee.LastName")
            ),
            {
              [Op.like]: `%${search}%`,
            }
          ),
        ],
      },
    ];
  }

  // 🔽 ORDER
  let order = [["createdAt", "DESC"]];

  if (sortKey === "accountableOfficer") {
    order = [
      [col("Employee.FirstName"), sortDir],
      [col("Employee.LastName"), sortDir],
    ];
  } else {
    order = [
      [sortKey, sortDir],
      ["createdAt", "DESC"],
    ];
  }

  const { rows, count } = await Record.findAndCountAll({
    where,
    limit,
    offset,
    distinct: true,

    include: [
      {
        model: Employee,
        attributes: ["FirstName", "LastName"],
      },
    ],

    order,
  });

  // 🎯 FORMAT OUTPUT
  const formattedRows = rows.map((record) => {
    const r = record.toJSON();

    return {
      ...r,
      accountableOfficer: `${r.Employee?.FirstName || ""} ${
        r.Employee?.LastName || ""
      }`.trim(),
    };
  });

  return {
    rows: formattedRows,
    total: count,
    page,
    limit,
  };
}

export async function getRecordByOfficeName(id, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }
  const where = {
    id,
    ...buildRecordScopeWhere(user),
  };

}

export async function getRecordById(id, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  const where = {
    id,
    ...buildRecordScopeWhere(user),
  };

  return await Record.findOne({ where });
}

export async function createRecord(data, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  if (user.role_id === ROLES.EMPLOYEE) {
    throw new Error("Employees are not allowed to create records.");
  }

  const payload = { ...data };
  payload.EmployeeNo = user.EmployeeNo;
  if (user.role_id === ROLES.ADMIN) {
    if (!user.SameDeptCode) {
      throw new Error("User has no SameDeptCode.");
    }

    payload.office = user.SameDeptCode;
  }

  console.log("createRecord received data:", data);

  return await Record.create(payload);
}

export async function updateRecord(id, data, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  if (user.role_id === ROLES.EMPLOYEE) {
    throw new Error("Employees are not allowed to update records.");
  }

  const record = await getRecordById(id, user);
  if (!record) return null;

  const payload = { ...data };

  if (user.role_id === ROLES.ADMIN) {
    if (!user.SameDeptCode) {
      throw new Error("User has no SameDeptCode.");
    }

    payload.office = user.SameDeptCode;
  }

  return await record.update(payload);
}

export async function deleteRecord(id, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  if (user.role_id === ROLES.EMPLOYEE) {
    throw new Error("Employees are not allowed to delete records.");
  }

  const record = await getRecordById(id, user);
  if (!record) return null;

  await record.destroy();
  return true;
}

// ----------- PDF Report -----------

export async function generateRecordsReportPdf(req, res) {
  let browser;

  try {
    const search = String(req.body?.search ?? "").trim();
    const office = String(req.body?.office ?? "All").trim();
    const paperSize = String(req.body?.paperSize ?? "auto").toLowerCase();
    const includeHeader = req.body?.includeHeader !== false;
    const includePageNumbers = req.body?.includePageNumbers !== false;

    if (!req.user) {
      throw new Error("Authenticated user not found.");
    }

    const where = buildRecordScopeWhere(req.user);

    if (req.user.role_id === ROLES.SUPER_ADMIN && office !== "All") {
      where.office = office;
    }

    if (search) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        {
          [Op.or]: [
            { article: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { propNumber: { [Op.like]: `%${search}%` } },
            { accountableOfficer: { [Op.like]: `%${search}%` } },
            { areMeNo: { [Op.like]: `%${search}%` } },
            { office: { [Op.like]: `%${search}%` } },
          ],
        },
      ];
    }

    const rows = await Record.findAll({
      where,
      order: [
        ["office", "ASC"],
        ["accountableOfficer", "ASC"],
        ["article", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    const assetsDir = path.join(__dirname, "..", "assets");
    const officialSealSrc = toDataUriPng(
      path.join(assetsDir, "Official_seal.png")
    );
    const bagongPilipinasSrc = toDataUriPng(
      path.join(assetsDir, "Bagong_Pilipinas.png")
    );

    const html = buildRecordsReportHtml({
      rows,
      search,
      office:
        req.user.role_id === ROLES.SUPER_ADMIN
          ? office
          : req.user.SameDeptCode ?? "N/A",
      officialSealSrc,
      bagongPilipinasSrc,
      includeHeader,
      includePageNumbers,
    });

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfOptions = {
      printBackground: true,
      margin: {
        top: includeHeader ? "80px" : "30px",
        right: "24px",
        bottom: includePageNumbers ? "50px" : "24px",
        left: "24px",
      },
      format:
        paperSize === "letter"
          ? "Letter"
          : "A4",
    };

    const pdf = await page.pdf(pdfOptions);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ICTO-Records-Report.pdf"'
    );

    return res.send(pdf);
  } catch (err) {
    console.error("Generate records report PDF error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate report",
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}           