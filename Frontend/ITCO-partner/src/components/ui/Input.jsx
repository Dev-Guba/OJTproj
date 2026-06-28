import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, required = false, className = "", id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="block">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={[
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm",
          "placeholder:text-slate-400 outline-none transition duration-150",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          error
            ? "border-red-500 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          className,
        ].join(" ")}
        {...props}
      />

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

export default Input;