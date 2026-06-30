import { useEffect, useId, useRef } from "react";
import Button from "./Button";

export default function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  confirmVariant = "primary",
  disabled = false,
  closeOnBackdrop = true,
}) {
  const panelRef = useRef(null);
  const titleId = useId();

  // Focus + scroll lock — only on actual open/close, never on every re-render
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open]);

  // Escape-to-close — safe to re-attach every render, doesn't touch focus
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !disabled) onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, disabled, onClose]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop && !disabled) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl outline-none"
      >
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 id={titleId} className="text-base font-semibold text-slate-900">
            {title}
          </h3>
        </div>

        <div className="px-6 py-5 text-sm leading-6 text-slate-600">
          {children}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={disabled}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={disabled}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}