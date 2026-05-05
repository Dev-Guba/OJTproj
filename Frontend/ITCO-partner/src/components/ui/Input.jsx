export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
          {label}
        </span>
      )}

      <input
        className={[
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm",
          "placeholder:text-slate-400 outline-none transition duration-150",
          "hover:border-slate-300",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300",
          className,
        ].join(" ")}
        {...props}
      />

      {error && (
        <span className="mt-1.5 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}