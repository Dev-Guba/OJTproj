import { Record } from "../models/index.js";
import puppeteer from "puppeteer";
import { Op } from "sequelize";
import { buildRecordsReportHtml } from "../templates/recordsReport.template.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

// Utility: chunk array (currently unused, but kept for pagination)
function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ----------- CRUD -----------

export async function getAllRecords() {
  return Record.findAll({ order: [["createdAt", "DESC"]] });
}

export async function getRecordById(id) {
  return Record.findByPk(id);
}

export async function createRecord(data) {
  return Record.create(data);
}

export async function updateRecord(id, data) {
  const record = await Record.findByPk(id);
  if (!record) return null;
  return record.update(data);
}

export async function deleteRecord(id) {
  const record = await Record.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return true;
}

// ----------- PDF Report -----------

export async function generateRecordsReportPdf(req, res) {
  let browser;
  try {
    // Extract filters and options
    const search = String(req.body?.search ?? "").trim();
    const office = String(req.body?.office ?? "All").trim();
    const paperSize = (req.body?.paperSize ?? "auto").toLowerCase();
    const includeHeader = req.body?.includeHeader !== false;
    const includePageNumbers = req.body?.includePageNumbers !== false;

    // Build query
    const where = {};
    if (office !== "All") where.office = office;
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

    // Fetch data
    const rows = await Record.findAll({ where, order: [["createdAt", "DESC"]] });

    // Logos
    const assetsDir = path.join(__dirname, "..", "assets");
    const officialSealSrc = toDataUriPng(path.join(assetsDir, "Official_seal.png"));
    const bagongPilipinasSrc = toDataUriPng(path.join(assetsDir, "bagong-pilipinas-logo.png"));

    // Header meta
    const printed = new Date().toLocaleString();
    const filterLine = [search && `Search: ${search}`, office !== "All" && `Office: ${office}`]
      .filter(Boolean)
      .join(" • ") || "No filters";

    // Build HTML
    const html = buildRecordsReportHtml({
      rows,
      includeHeader,
      printed,
      filterLine,
      totalRecords: rows.length,
      officialSealSrc,
      bagongPilipinasSrc,
    });

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // PDF options
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

    // Send PDF
    const filename = `ICTO-Records-Report-${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Report generation failed", error: err.message });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}