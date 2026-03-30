import Modal from "../ui/Modal";

export default function ReportOptionsModal({
  open,
  reportPaper,
  reportPerPage,
  reportIncludeHeader,
  reportIncludePageNumbers,
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
      title="Generate Report"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="Generate"
    >
      <div className="space-y-5">
        <div>
          <div className="text-sm font-semibold text-gray-900">Paper Size:</div>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paper"
                checked={reportPaper === "auto"}
                onChange={() => setReportPaper("auto")}
              />
              <span>Auto</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paper"
                checked={reportPaper === "a4"}
                onChange={() => setReportPaper("a4")}
              />
              <span>A4</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paper"
                checked={reportPaper === "letter"}
                onChange={() => setReportPaper("letter")}
              />
              <span>Letter</span>
            </label>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900">
            Records Per Page:
          </div>
          <div className="mt-2">
            <select
              className="w-32 rounded-xl border px-3 py-2 text-sm"
              value={reportPerPage}
              onChange={(e) => setReportPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900">Include:</div>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reportIncludeHeader}
                onChange={(e) => setReportIncludeHeader(e.target.checked)}
              />
              <span>Header</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reportIncludePageNumbers}
                onChange={(e) =>
                  setReportIncludePageNumbers(e.target.checked)
                }
              />
              <span>Page Numbers</span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}