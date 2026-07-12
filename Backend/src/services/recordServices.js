import { Record, Employee, Article } from "../models/index.js";
import puppeteer from "puppeteer";
import { Op, where as sequelizeWhere, fn, col } from "sequelize";
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

// Resolve the numeric Employee PK (EmployeeId) from the logged-in user.
// Records are linked via Record.employee_id -> Employee.EmployeeId, but
// the auth/session object generally only carries the business code
// (EmployeeNo, e.g. "EMP001"). This bridges the two.
async function resolveEmployeeId(user) {
  if (user.EmployeeId) return user.EmployeeId;

  if (!user.EmployeeNo) {
    throw new Error("User has no linked EmployeeNo.");
  }

  const employee = await Employee.findOne({
    where: { EmployeeNo: user.EmployeeNo },
    attributes: ["EmployeeId"],
  });

  if (!employee) {
    throw new Error("Linked employee record not found.");
  }

  return employee.EmployeeId;
}

async function buildRecordScopeWhere(user) {
  if (!user) throw new Error("Authenticated user not found.");

  switch (user.role_id) {
    case ROLES.SUPER_ADMIN:
      return {}; // all records

    case ROLES.ADMIN:
      // If SameDeptCode exists, filter by office
      // Otherwise, return no filter to prevent 403
      return user.SameDeptCode ? { office: user.SameDeptCode } : {};

    case ROLES.EMPLOYEE: {
      const employeeId = await resolveEmployeeId(user);
      return { employee_id: employeeId };
    }

    default:
      return {};
  }
}

// ----------- CRUD -----------

export async function getAllRecords(user, query = {}) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 50;
  const offset = (page - 1) * limit;

  const search = String(query.search ?? "").trim();
  const office = String(query.office ?? "All").trim();

  const allowedSortKeys = [
    "office",
    "status",
    "areMeNo",
    "issuedDate",
    "returnedDate",
    "createdAt",
    "accountableOfficer",
    "article",
    "description",
    "propNumber",
  ];

  const sortKey = allowedSortKeys.includes(query.sortKey)
    ? query.sortKey
    : "createdAt";

  const sortDir =
    String(query.sortDir).toLowerCase() === "asc"
      ? "ASC"
      : "DESC";


  const where = await buildRecordScopeWhere(user);


  // Super Admin office filtering
  if (user.role_id === ROLES.SUPER_ADMIN && office !== "All") {
    where.office = office;
  }


  // Search
  if (search) {

    where[Op.and] = [
      ...(where[Op.and] || []),

      {
        [Op.or]: [

          {
            areMeNo: {
              [Op.like]: `%${search}%`,
            },
          },

          {
            office: {
              [Op.like]: `%${search}%`,
            },
          },

          {
            status: {
              [Op.like]: `%${search}%`,
            },
          },


          sequelizeWhere(
            fn(
              "CONCAT",
              col("Employee.FirstName"),
              " ",
              col("Employee.LastName")
            ),
            {
              [Op.like]: `%${search}%`,
            }
          ),


          {
            "$Article.article$": {
              [Op.like]: `%${search}%`,
            },
          },

          {
            "$Article.description$": {
              [Op.like]: `%${search}%`,
            },
          },

          {
            "$Article.propNumber$": {
              [Op.like]: `%${search}%`,
            },
          },

        ],
      },
    ];
  }



  // Sorting
  let order = [];

  switch (sortKey) {

    case "accountableOfficer":

      order = [
        [
          Employee,
          "FirstName",
          sortDir
        ],
        [
          Employee,
          "LastName",
          sortDir
        ],
      ];

      break;



    case "article":

      order = [
        [
          Article,
          "article",
          sortDir
        ],
      ];

      break;



    case "description":

      order = [
        [
          Article,
          "description",
          sortDir
        ],
      ];

      break;



    case "propNumber":

      order = [
        [
          Article,
          "propNumber",
          sortDir
        ],
      ];

      break;



    default:

      order = [
        [
          sortKey,
          sortDir
        ],
      ];

      if (sortKey !== "createdAt") {
        order.push([
          "createdAt",
          "DESC"
        ]);
      }

      break;
  }



  const { rows, count } = await Record.findAndCountAll({

    where,

    limit,

    offset,

    distinct: true,


    include: [

      {
        model: Employee,

        attributes: [
          "EmployeeId",
          "FirstName",
          "LastName",
        ],

        required:false,
      },


      {
        model: Article,

        required:false,
      },

    ],


    order,

  });



  const formattedRows = rows.map(record => {

    const r = record.toJSON();


    return {
      id: r.id,
      employee_id: r.employee_id,
      article_id: r.article_id,
      areMeNo: r.areMeNo,
      office: r.office,
      status: r.status,
      issuedDate: r.issuedDate,
      returnedDate: r.returnedDate,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      accountableOfficer:
        `${r.Employee?.FirstName ?? ""} ${r.Employee?.LastName ?? ""}`
        .trim(),
      article: r.Article?.article ?? null,
      description: r.Article?.description ?? null,
      propNumber: r.Article?.propNumber ?? null,
      dateAcquired: r.Article?.dateAcquired ?? null,
      unit: r.Article?.unit ?? null,
      unitValue: r.Article?.unitValue ?? null,
      balQty: r.Article?.balQty ?? null,
      balValue: r.Article?.balValue ?? null,

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
    ...(await buildRecordScopeWhere(user)),
  };

}

export async function getRecordById(id, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  const where = {
    id,
    ...(await buildRecordScopeWhere(user)),
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

  const employeeId = await resolveEmployeeId(user);

  const payload = { ...data };
  payload.employee_id = employeeId;

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

  // NOTE: employee_id (ownership) is intentionally left untouched here.
  // Editing a record's article/description/etc. as an Admin/SuperAdmin
  // should not reassign who the accountable officer is. If you DO want
  // edits to reassign ownership to the editor, uncomment:
  // payload.employee_id = await resolveEmployeeId(user);

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

    const where = await buildRecordScopeWhere(req.user);

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
            { areMeNo: { [Op.like]: `%${search}%` } },
            { office: { [Op.like]: `%${search}%` } },
            sequelizeWhere(
              fn(
                "concat",
                col("Employee.FirstName"),
                " ",
                col("Employee.LastName")
              ),
              { [Op.like]: `%${search}%` }
            ),
          ],
        },
      ];
    }

    const records = await Record.findAll({
      where,
      include: [
        {
          model: Employee,
          attributes: ["FirstName", "LastName"],
        },
      ],
      order: [
        ["office", "ASC"],
        [col("Employee.FirstName"), "ASC"],
        [col("Employee.LastName"), "ASC"],
        ["article", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    // Compute accountableOfficer the same way getAllRecords does
    const rows = records.map((record) => {
      const r = record.toJSON();
      return {
        ...r,
        accountableOfficer: `${r.Employee?.FirstName || ""} ${
          r.Employee?.LastName || ""
        }`.trim(),
      };
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
      format: paperSize === "letter" ? "Letter" : "A4",
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