import { forwardRef, useId } from "react";

const Select = forwardRef(function Select(
  { label, error, hint, required = false, className = "", id, children, ...props },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className="block">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={[
            "w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-900 shadow-sm",
            "outline-none transition duration-150",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
            error
              ? "border-red-500 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            className,
          ].join(" ")}
          {...props}
        >
          {children}
        </select>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {error ? (
        <span id={errorId} className="mt-1.5 block text-xs font-medium text-red-600">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="mt-1.5 block text-xs text-slate-400">
          {hint}
        </span>
      ) : null}
    </div>
  );
});

export default Select;