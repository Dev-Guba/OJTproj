import Modal from "../ui/Modal";

const RadioOption = ({ name, value, checked, onChange, label }) => (
  <label className="flex cursor-pointer items-center gap-2.5">
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="accent-[#1e3a5f]"
    />
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);

const CheckOption = ({ checked, onChange, label }) => (
  <label className="flex cursor-pointer items-center gap-2.5">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="accent-[#1e3a5f]"
    />
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);

export default function ReportOptionsModal({
  open,

  reportPaper,
  reportPerPage,
  reportIncludeHeader,
  reportIncludePageNumbers,

  reportFormat,
  setReportFormat,

  onClose,
  onConfirm,

  setReportPaper,
  setReportPerPage,
  setReportIncludeHeader,
  setReportIncludePageNumbers,
}) {
  return (
<Modal
  open={open}
  title="Export Records Report"
  onClose={onClose}
  onConfirm={onConfirm}
  confirmText={
    reportFormat === "pdf"
      ? "Export PDF"
      : "Export Excel"
  }
  confirmVariant="primary"
>
      <div className="space-y-5">

{/* ================= Export Format ================= */}

<div>
  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
    Export Format
  </div>

  <div className="space-y-3 rounded-xl border border-slate-200 p-4">

    <RadioOption
      name="format"
      value="pdf"
      checked={reportFormat === "pdf"}
      onChange={() => setReportFormat("pdf")}
      label="PDF Document (.pdf)"
    />

    <RadioOption
      name="format"
      value="excel"
      checked={reportFormat === "excel"}
      onChange={() => setReportFormat("excel")}
      label="Excel Spreadsheet (.xlsx)"
    />

  </div>
</div>

{reportFormat === "pdf" && (
  <div className="space-y-5 rounded-xl border border-slate-200 p-4">
    <div>
  <h3 className="text-sm font-semibold text-slate-800">
    PDF Options
  </h3>

  <p className="mt-1 text-xs text-slate-500">
    These settings only apply when exporting as PDF.
  </p>
</div>
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Paper Size
      </div>

      <div className="flex gap-4">
        <RadioOption
          name="paper"
          value="auto"
          checked={reportPaper === "auto"}
          onChange={() => setReportPaper("auto")}
          label="Auto"
        />

        <RadioOption
          name="paper"
          value="a4"
          checked={reportPaper === "a4"}
          onChange={() => setReportPaper("a4")}
          label="A4 Landscape"
        />

        <RadioOption
          name="paper"
          value="letter"
          checked={reportPaper === "letter"}
          onChange={() => setReportPaper("letter")}
          label="Letter Landscape"
        />
      </div>
    </div>

    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Records Per Page
      </div>

      <select
        className="w-36 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        value={reportPerPage}
        onChange={(e) => setReportPerPage(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>

    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Include
      </div>

      <div className="space-y-2">

        <CheckOption
          checked={reportIncludeHeader}
          onChange={(e) =>
            setReportIncludeHeader(e.target.checked)
          }
          label="Government Header"
        />

        <CheckOption
          checked={reportIncludePageNumbers}
          onChange={(e) =>
            setReportIncludePageNumbers(e.target.checked)
          }
          label="Page Numbers"
        />

      </div>
    </div>
  </div>
)}
      </div>
    </Modal>
  );
}