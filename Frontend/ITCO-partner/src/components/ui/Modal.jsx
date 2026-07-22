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

  // Focus + scroll lock
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

  // Escape-to-close
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !disabled) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, disabled, onClose]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop && !disabled) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl outline-none"
      >
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <h3
            id={titleId}
            className="text-base font-semibold text-slate-900"
          >
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5 text-sm leading-6 text-slate-600">
          {children}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={disabled}
            className="w-full sm:w-auto"
          >
            Exit
          </Button>

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={disabled}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}