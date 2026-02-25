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
  printed,
  filterLine,
  totalRecords,
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

      .title { font-size: 18px; font-weight: 800; margin: 0 0 6px 0; }
      .meta  { font-size: 11px; color: #444; margin: 0 0 10px 0; line-height: 1.35; }

      /* ✅ TABLE: fixed layout + widths to prevent header text combining */
      table.tbl {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed; /* ✅ IMPORTANT */
        border: 1px solid #9ca3af;
      }

      table.tbl th, table.tbl td {
        border: 1px solid #9ca3af;
        padding: 8px;
        vertical-align: top;
        overflow: hidden;          /* ✅ prevents overlap */
        text-overflow: ellipsis;   /* ✅ trims nicely */
        word-break: break-word;
      }

      table.tbl thead th {
        background: #f9fafb;
        color: #374151;
        font-weight: 700;
        white-space: nowrap; /* ✅ keeps header readable */
      }

      .center { text-align: center; }
      .num { text-align: right; white-space: nowrap; }
      .font-medium { font-weight: 700; }

      .empty {
        text-align: center;
        color: #6b7280;
        padding: 16px;
      }

      /* ✅ ARLEE row */
      .arleeRow {
  height: 40px;                  /* h-10 */
  background: #bae6fd;           /* bg-sky-200 */
  color: #b91c1c;                /* text-red-700 */
  font-size: 24px;               /* text-2xl */
  font-weight: 700;              /* font-bold */
  text-align: center;            /* text-center */
  padding: 0 16px;               /* px-4 py-0 */
  line-height: 40px;             /* leading-none */
  letter-spacing: 2px;           /* letterSpacing */
  font-family: 'Cinzel', serif;  /* wood style */
}

      .tight { line-height: 1.1; display: inline-block; }
    </style>
  </head>

  <body>
    ${
      includeHeader
        ? `
      <div class="title">ICTO Records Report</div>
      <div class="meta">
        <div>Printed: ${escapeHtml(printed)}</div>
        <div>Filters: ${escapeHtml(filterLine)}</div>
        <div>Total Records: ${totalRecords}</div>
      </div>
    `
        : ``
    }

    <table class="tbl">
      <!-- ✅ Fixed widths for each of the 11 columns -->
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

        <!-- ✅ Always-visible Info Row -->
        <tr>
          <th colspan="11" class="arleeRow">
            ARLEE CARLOS (Information Technology Officer I)
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
