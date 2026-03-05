// src/templates/recordsReport.template.js

function escapeHtml(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(v) {
  if (!v) return "";
  return String(v);
}

export function buildRecordsReportHtml({
  rows,
  includeHeader,
  

  // ✅ NEW: pass image src as data-uri from controller
  officialSealSrc = "",
  bagongPilipinasSrc = "",
}) {
  const body = rows.length
    ? rows
        .map((r) => {
          return `
            <tr>
              <td>${escapeHtml(r.article)}</td>
              <td>${escapeHtml(r.description)}</td>
              <td class="font-medium">${escapeHtml(r.propNumber)}</td>
              <td>${escapeHtml(formatDate(r.dateAcquired))}</td>
              <td>${escapeHtml(r.unit)}</td>
              <td class="num">${escapeHtml(r.unitValue)}</td>
              <td class="num">${escapeHtml(r.balQty)}</td>
              <td class="num">${escapeHtml(r.balValue)}</td>
              <td>${escapeHtml(r.accountableOfficer)}</td>
              <td>${escapeHtml(r.areMeNo)}</td>
              <td>${escapeHtml(r.office)}</td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="11" class="empty">No records found.</td></tr>`;

  const govtHeader = `
    <div class="gov-header">
      <div class="logos">
        ${
          officialSealSrc
            ? `<img class="logo" src="${officialSealSrc}" alt="Official Seal" />`
            : ""
        }
        ${
          bagongPilipinasSrc
            ? `<img class="logo" src="${bagongPilipinasSrc}" alt="Bagong Pilipinas" />`
            : ""
        }
      </div>

      <div class="gov-text">
        <div class="gov-line">REPUBLIC OF THE PHILIPPINES</div>
        <div class="gov-line">PROVINCE OF CEBU</div>
        <div class="gov-line bold">PROVINCIAL ADMINISTRATOR'S OFFICE</div>
        <div class="gov-line">2/F East Wing, Provincial Capitol, N. Escario St., Cebu City 6000 Philippines</div>
        <div class="gov-line">Telephone (032) 888-2333/(032) 888-2328 local 1031 &amp; 1039</div>

      
      </div>
    </div>
  `;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { margin: 12mm; }
      body {
        font-family: Arial, Helvetica, sans-serif;
        color: #111;
        font-size: 11px;
      }

      /* ✅ Try to load Cinzel (works if Puppeteer can access internet) */
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&display=swap');

      /* =========================
         ✅ GOVERNMENT HEADER
         ========================= */
      .gov-header{
        display:flex;
        gap:14px;
        align-items:flex-start;
        padding-bottom:10px;
        margin-bottom:10px;
        border-bottom:1px solid #e5e7eb; /* gray-200 */
      }

      .logos{
       
        display:flex;
        flex-direction:row;
        align-items:center;
        gap:12px;
        flex: 0 0 auto;
      }

      .logo{
        width:70px;
        height:auto;
        object-fit:contain;
      }

      .gov-text{
        flex:1;
        min-width:0;
      }

      .gov-line{
        line-height:1.25;
        margin:0;
        white-space:normal;
      }

      .bold{ font-weight:800;}


      .gov-line.bold{
        font-size:14px;
        letter-spacing:0.5px;
      }




      .report-meta{
        margin-top:8px;
        font-size:11px;
        color:#444;
        line-height:1.35;
      }

      /* =========================
         ✅ TABLE (your style)
         ========================= */
      table.tbl {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        border: 1px solid #9ca3af;
      }

      table.tbl th, table.tbl td {
        border: 1px solid #9ca3af;
        padding: 8px;
        vertical-align: top;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
      }

      table.tbl thead th {
        background: #f9fafb;
        color: #374151;
        font-weight: 700;
        white-space: nowrap;
      }

      .center { text-align: center; }
      .num { text-align: right; white-space: nowrap; }
      .font-medium { font-weight: 700; }

      .empty {
        text-align: center;
        color: #6b7280;
        padding: 16px;
      }

      /* ✅ ARLEE row  */
      .arleeRow {
        height: 30px;
        background: #bae6fd;           /* sky-200 */
        color: #b91c1c;                /* red-700-ish */
        font-size: 24px;
        font-weight: 700;
        text-align: center;
        padding: 0 16px;
        line-height: 40px;
        letter-spacing: 2px;
        font-family: 'Cinzel', serif;
      }

      .tight { line-height: 1.1; display: inline-block; }
    </style>
  </head>

  <body>
    ${
      includeHeader
        ? govtHeader
        : ``
    }

    <table class="tbl">
      <colgroup>
        <col style="width:10%">
        <col style="width:14%">
        <col style="width:9%">
        <col style="width:9%">
        <col style="width:6%">
        <col style="width:7%">
        <col style="width:5%">
        <col style="width:7%">
        <col style="width:13%">
        <col style="width:10%">
        <col style="width:10%">
      </colgroup>

      <thead>
        <tr>
          <th rowspan="2">Article</th>
          <th rowspan="2">Description</th>
          <th rowspan="2">Prop No.</th>
          <th rowspan="2">Date Acquired</th>
          <th rowspan="2">Unit</th>

          <th rowspan="2" class="center">
            <span class="tight">Unit<br/>Value</span>
          </th>

          <th colspan="2" class="center">Bal. per stockcard</th>

          <th rowspan="2">Accountable Officer</th>
          <th rowspan="2">ARE No. / ME No.</th>
          <th rowspan="2">Office</th>
        </tr>

        <tr>
          <th class="center">Qty</th>
          <th class="center">Value</th>
        </tr>

        <tr>
          <th colspan="11" class="arleeRow">
            ARLEE CARLO S. (Information Technology Officer I)
          </th>
        </tr>
      </thead>

      <tbody>
        ${body}
      </tbody>
    </table>
  </body>
</html>`;
}