import { Record, Employee, Article } from "../models/index.js";
import sequelize from "../config/db.js";
import puppeteer from "puppeteer";
import ExcelJS from "exceljs";
import { Op, where as sequelizeWhere, fn, col } from "sequelize";
import { buildRecordsReportHtml } from "../templates/recordsReport.template.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ROLES } from "../constants/roles.js";
import {createForRecord} from "./backlogServices.js";

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

  const transaction = await sequelize.transaction();

  try {
    const payload = { ...data };

    if (!payload.employee_id) {
      throw new Error("Employee is required.");
    }

    if (!payload.article_id) {
      throw new Error("Article is required.");
    }

    const employee = await Employee.findByPk(payload.employee_id, {
      transaction,
    });

    if (!employee) {
      throw new Error("Employee not found.");
    }

    if (
      user.role_id === ROLES.ADMIN &&
      employee.SameDeptCode !== user.SameDeptCode
    ) {
      throw new Error(
        "You are not allowed to issue assets to employees from another office."
      );
    }

    const article = await Article.findByPk(payload.article_id, {
      transaction,
      lock: true,
    });

    if (!article) {
      throw new Error("Article not found.");
    }

    const qty = Number(article.balQty);

    if (qty <= 0) {
      throw new Error("This article is already out of stock.");
    }

    payload.office = employee.SameDeptCode;

    const record = await Record.create(payload, {
      transaction,
    });
    console.log(user);
    console.log("EmployeeId:", user.EmployeeId);
    console.log("employeeId:", user.employeeId);
    await createForRecord(
  {
    recordId: record.id,

    articleId: record.article_id,

    previousEmployeeId: null,

    newEmployeeId: record.employee_id,

    performedBy: user.employeeId,

    action: "CREATED",

    remarks: `Assigned ${article.article} to ${employee.FirstName} ${employee.LastName}`,
  },
  transaction
);

    const newQty = qty - 1;

    const unitValue = Number(article.unitValue || 0);

    await article.update(
      {
        balQty: newQty,
        balValue: newQty * unitValue,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return record;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export async function updateRecord(id, data, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  if (user.role_id === ROLES.EMPLOYEE) {
    throw new Error("Employees are not allowed to update records.");
  }

  const transaction = await sequelize.transaction();

  try {
    const record = await getRecordById(id, user);

    if (!record) return null;

    // Save the old owner before updating
    const previousEmployeeId = record.employee_id;

    const payload = { ...data };

    if (user.role_id === ROLES.ADMIN) {
      if (!user.SameDeptCode) {
        throw new Error("User has no SameDeptCode.");
      }

      payload.office = user.SameDeptCode;
    }

    const updatedRecord = await record.update(payload, {
      transaction,
    });

    // Get the employees for the remarks
    const previousEmployee = await Employee.findByPk(previousEmployeeId, {
      transaction,
    });

    const newEmployee = await Employee.findByPk(updatedRecord.employee_id, {
      transaction,
    });

    const article = await Article.findByPk(updatedRecord.article_id, {
      transaction,
    });

    await createForRecord(
      {
        recordId: updatedRecord.id,
        articleId: updatedRecord.article_id,
        previousEmployeeId,
        newEmployeeId: updatedRecord.employee_id,
        performedBy: user.EmployeeId,
        action: "TRANSFERRED",
        remarks: `Transferred ${article.article} from ${previousEmployee.FirstName} ${previousEmployee.LastName} to ${newEmployee.FirstName} ${newEmployee.LastName}`,
      },
      transaction
    );

    await transaction.commit();

    return updatedRecord;

  } catch (err) {
    await transaction.rollback();
    throw err;
  }
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
  landscape: true,
  printBackground: true,
  format: paperSize === "letter" ? "Letter" : "A4",

  margin: {
    top: includeHeader ? "60px" : "20px",
    right: "20px",
    bottom: includePageNumbers ? "40px" : "20px",
    left: "20px",
  },
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

export async function generateRecordsReportExcel(req, res) {
  try {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("ICTO Records");

    worksheet.addRow(["Hello"]);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ICTO-Records.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success:false,
      message:"Failed to generate excel"
    });

  }
}