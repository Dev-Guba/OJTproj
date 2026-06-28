import Modal from "../ui/Modal";

export default function DeleteRecordModal({ open, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      title="Remove this record?"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="Remove"
      confirmVariant="danger"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-500" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">This cannot be undone.</p>
          <p className="mt-1 text-sm text-slate-500">
            The record will be permanently removed from storage.
          </p>
        </div>
      </div>
    </Modal>
  );
}