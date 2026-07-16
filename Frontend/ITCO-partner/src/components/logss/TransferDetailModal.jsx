import { X, ArrowRight } from "lucide-react";

export default function TransferDetailModal({ log, onClose }) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Transfer Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400">Asset</span>
            <p className="font-medium text-slate-800">
              {log.articleName}{" "}
              <span className="text-slate-400">({log.propNumber})</span>
            </p>
          </div>

          <div>
            <span className="text-slate-400">Ownership Change</span>
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-slate-50 p-2.5">
              <div className="flex-1 text-center">
                <p className="text-[10px] text-slate-400">Previous</p>
                <p className="font-medium text-slate-800">
                  {log.previousOwner || "—"}
                </p>
              </div>

              <ArrowRight className="shrink-0 text-slate-400" size={14} />

              <div className="flex-1 text-center">
                <p className="text-[10px] text-slate-400">New Owner</p>
                <p className="font-medium text-[#1e3a5f]">
                  {log.newOwner || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <span className="text-slate-400">Office</span>
              <p className="font-medium text-slate-800">{log.office}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Date</span>
              <p className="font-medium text-slate-800">{log.time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}