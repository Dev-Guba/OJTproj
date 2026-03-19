export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 shadow-sm",
    secondary:
      "bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-200 border border-blue-200",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 shadow-sm",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
}