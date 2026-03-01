import { Record } from "../models/index.js";
import puppeteer from "puppeteer";
import { Op } from "sequelize";
import { buildRecordsReportHtml } from "../templates/recordsReport.template.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ======================
   CRUD
====================== */
export async function getAllRecords(req, res) {
  try {
    const rows = await Record.findAll({ order: [["createdAt", "DESC"]] });
    console.log("Fetched records:", rows.length);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export async function getRecordById(req, res) {
  try {
    const row = await Record.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Record not found" });
    return res.json(row);
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export async function createRecord(req, res) {
  try {
    const created = await Record.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: "Create failed", error: err.message });
  }
}

export async function updateRecord(req, res) {
  try {
    const row = await Record.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Record not found" });

    await row.update(req.body);
    return res.json(row);
  } catch (err) {
    return res.status(400).json({ message: "Update failed", error: err.message });
  }
}

export async function deleteRecord(req, res) {
  try {
    const row = await Record.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Record not found" });

    await row.destroy();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ message: "Delete failed", error: err.message });
  }
}

/* ======================
   PDF Report (Puppeteer)
   POST /records/report
   Body:
   {
     search, office,
     paperSize: "auto" | "a4" | "letter",
     perPage: 20,
     includeHeader: true,
     includePageNumbers: true
   }
====================== */
function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toDataUriPng(absPath) {
  // returns "" if missing (so template simply hides the image)
  try {
    const buf = fs.readFileSync(absPath);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

export async function generateRecordsReportPdf(req, res) {
  let browser = null;

  try {
    const search = String(req.body?.search ?? "").trim();
    const office = String(req.body?.office ?? "All").trim();
    const paperSize = String(req.body?.paperSize ?? "auto").toLowerCase();
    const perPage = Number(req.body?.perPage ?? 20) || 20;

    const includeHeader =
      req.body?.includeHeader === true ||
      String(req.body?.includeHeader ?? "true") === "true";

    const includePageNumbers =
      req.body?.includePageNumbers === true ||
      String(req.body?.includePageNumbers ?? "true") === "true";

    const where = {};

    if (office && office !== "All") where.office = office;

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
    });

    // ---- ✅ LOGO DATA URI (base64) ----
    // Your logos are in: Backend/src/assets/
    // NOTE: filename is case-sensitive on some systems.
    const assetsDir = path.join(__dirname, "..", "assets");

    const officialSealSrc = toDataUriPng(
      path.join(assetsDir, "Official_seal.png")
    );

    const bagongPilipinasSrc = toDataUriPng(
      path.join(assetsDir, "bagong-pilipinas-logo.png")
    );

    // ---- header meta ----
    const printed = new Date().toLocaleString();
    const filterLine =
      [
        search ? `Search: ${search}` : null,
        office !== "All" ? `Office: ${office}` : null,
      ]
        .filter(Boolean)
        .join(" • ") || "No filters";

    // ✅ Build HTML (pass logo src)
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

    const format =
      paperSize === "a4" ? "A4" : paperSize === "letter" ? "Letter" : "A4";

    const pdfOptions = {
      format,
      landscape: true,
      printBackground: true,
      margin: {
        top: includeHeader ? "12mm" : "10mm",
        bottom: includePageNumbers ? "14mm" : "10mm",
        left: "10mm",
        right: "10mm",
      },
    };

    if (includePageNumbers) {
      pdfOptions.displayHeaderFooter = true;
      pdfOptions.headerTemplate = `<div></div>`;
      pdfOptions.footerTemplate = `
        <div style="font-size:10px;width:100%;text-align:center;color:#444;padding:0 10px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `;
    } else {
      pdfOptions.displayHeaderFooter = false;
    }

    const pdf = await page.pdf(pdfOptions);

    const filename = `ICTO-Records-Report-${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(pdf);
  } catch (err) {
    return res.status(500).json({
      message: "Report generation failed",
      error: err.message,
    });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}