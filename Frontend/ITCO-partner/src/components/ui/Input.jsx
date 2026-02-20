export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-gray-800">{label}</span>}

      <input
        className={[
          "w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900",
          "outline-none transition",
          "focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10",
          error ? "border-red-500 focus:border-red-600 focus:ring-red-600/10" : "border-gray-200",
          className,
        ].join(" ")}
        {...props}
      />

      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}