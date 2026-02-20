export default function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <select
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
