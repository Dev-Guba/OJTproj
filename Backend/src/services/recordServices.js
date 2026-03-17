import { Record } from "../models/index.js";
import puppeteer from "puppeteer";
import { Op } from "sequelize";
import { buildRecordsReportHtml } from "../templates/recordsReport.template.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ROLES } from "../constants/roles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility: read image as base64 for PDF header
function toDataUriPng(absPath) {
  try {
    const buf = fs.readFileSync(absPath);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return "";
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
    "accountableOfficer",
    "areMeNo",
    "office",
    "createdAt",
  ];

  const sortKey = allowedSortKeys.includes(query.sortKey)
    ? query.sortKey
    : "createdAt";

  const sortDir =
    String(query.sortDir).toLowerCase() === "asc" ? "ASC" : "DESC";

  const where = {};

  if (!user) {
    throw new Error("Authenticated user not found.");
  }


  if (user.role_id !== ROLES.SUPER_ADMIN) {
    if (!user.SameDeptCode) {
      throw new Error("User has no SameDeptCode.");
    }

    where.office = user.SameDeptCode;
  }

  if (search) {
    where[Op.or] = [
      { article: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { propNumber: { [Op.like]: `%${search}%` } },
      { accountableOfficer: { [Op.like]: `%${search}%` } },
      { areMeNo: { [Op.like]: `%${search}%` } },
      { office: { [Op.like]: `%${search}%` } },
    ];
  }

  const { rows, count } = await Record.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortKey, sortDir]],
  });

  return {
    rows,
    total: count,
    page,
    limit,
  };
}

export async function getRecordById(id, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  const where = { id };

  if (user.role_id !== ROLES.SUPER_ADMIN) {
    if (!user.SameDeptCode) {
      throw new Error("User has no SameDeptCode.");
    }

    where.office = user.SameDeptCode;
  }

  return Record.findOne({ where });
}


export async function createRecord(data, user) {
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  const payload = { ...data };

  if (user.role_id !== ROLES.SUPER_ADMIN) {
    if (!user.SameDeptCode) {
      throw new Error("User has no SameDeptCode.");
    }

    payload.office = user.SameDeptCode;
  }

  return Record.create(payload);
}

export async function updateRecord(id, data, user) {
  const record = await getRecordById(id, user);
  if (!record) return null;

  const payload = { ...data };

  if (user.role_id !== ROLES.SUPER_ADMIN) {
    if (!user.SameDeptCode) {
      throw new Error("User has no SameDeptCode.");
    }

    payload.office = user.SameDeptCode;
  }

  return record.update(payload);
}

export async function deleteRecord(id, user) {
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

    const where = {};

    if (req.user.role_id !== ROLES.SUPER_ADMIN) {
      if (!req.user.SameDeptCode) {
        throw new Error("User has no SameDeptCode.");
      }

      where.office = req.user.SameDeptCode;
    } else if (office !== "All") {
      // Super Admin can choose office
      where.office = office;
    }

    if (search) {
      where[Op.or] = [
        { article: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { propNumber: { [Op.like]: `%${search}%` } },
        { accountableOfficer: { [Op.like]: `%${search}%` } },
        { areMeNo: { [Op.like]: `%${search}%` } },
        { office: { [Op.like]: `%${search}%` } },
      ];
    }

    const rows = await Record.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });    const assetsDir = path.join(__dirname, "..", "assets");
    const officialSealSrc = toDataUriPng(
      path.join(assetsDir, "Official_seal.png")
    );
    const bagongPilipinasSrc = toDataUriPng(
      path.join(assetsDir, "bagong-pilipinas-logo.png")
    );

    const printed = new Date().toLocaleString();

    const filterLine =
      [
        search && `Search: ${search}`,
        req.user.role_id === ROLES.SUPER_ADMIN && office !== "All" && `Office: ${office}`,
      ]
        .filter(Boolean)
        .join(" • ") || "No filters";

    const html = buildRecordsReportHtml({
      rows,
      includeHeader,
      printed,
      filterLine,
      totalRecords: rows.length,
      officialSealSrc,
      bagongPilipinasSrc,
    });

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfOptions = {
      format: paperSize === "letter" ? "Letter" : "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: includeHeader ? "12mm" : "10mm",
        bottom: includePageNumbers ? "14mm" : "10mm",
        left: "10mm",
        right: "10mm",
      },
      displayHeaderFooter: includePageNumbers,
      headerTemplate: `<div></div>`,
      footerTemplate: includePageNumbers
        ? `<div style="font-size:10px;width:100%;text-align:center;color:#444;padding:0 10px;">
             Page <span class="pageNumber"></span> of <span class="totalPages"></span>
           </div>`
        : undefined,
    };

    const pdf = await page.pdf(pdfOptions);

    const filename = `ICTO-Records-Report-${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.send(pdf);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({
      message: "Report generation failed",
      error: err.message,
    });
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}