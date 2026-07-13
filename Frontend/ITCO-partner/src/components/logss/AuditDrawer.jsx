import { X } from "lucide-react";
import AuditBadge from "./AuditBadge";

export default function AuditDrawer({ open, log, onClose }) {
  if (!open || !log) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div>
            <h2 className="text-xl font-bold">
              Audit Details
            </h2>

            <p className="text-gray-500 text-sm">
              View complete audit information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          <Info
            label="User"
            value={log.user}
          />

          <Info
            label="Module"
            value={log.module}
          />

          <div>

            <p className="text-gray-500 text-sm mb-2">
              Action
            </p>

            <AuditBadge action={log.action} />

          </div>

          <Info
            label="Entity"
            value={log.entity}
          />

          <Info
            label="Entity ID"
            value={log.entityId}
          />

          <Info
            label="Date"
            value={log.date}
          />

          <Info
            label="Time"
            value={log.time}
          />

          <div>

            <p className="text-gray-500 text-sm mb-2">
              Before
            </p>

            <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-auto">
{`{
  "status": "Available",
  "office": "ICTO"
}`}
            </pre>

          </div>

          <div>

            <p className="text-gray-500 text-sm mb-2">
              After
            </p>

            <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-auto">
{`{
  "status": "Issued",
  "office": "ICTO"
}`}
            </pre>

          </div>

        </div>

      </div>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>

      <p className="text-gray-500 text-sm">
        {label}
      </p>

      <p className="font-medium mt-1">
        {value}
      </p>

    </div>
  );
}