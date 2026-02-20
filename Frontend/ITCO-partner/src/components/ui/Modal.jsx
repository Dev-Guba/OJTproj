import Button from "./Button";

export default function Modal({ open, title, children, onClose, onConfirm, confirmText = "Confirm" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="border-b px-5 py-4">
          <h3 className="text-base font-semibold">{title}</h3>
        </div>

        <div className="px-5 py-4 text-sm text-gray-700">{children}</div>

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}