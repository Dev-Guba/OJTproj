import { forwardRef } from "react";

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-9 w-9 p-0",
};

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 shadow-sm",
  secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-200 border border-blue-200",
  outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
  "outline-dark": "border border-white/20 bg-transparent text-white hover:bg-white/10 focus:ring-white/30 focus:ring-offset-[#08204a]",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 shadow-sm",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
};

const Button = forwardRef(function Button(
  {
    children,
    className = "",
    variant = "primary",
    size = "md",
    type = "button",
    loading = false,
    disabled = false,
    ...props
  },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";

  const isDisabled = loading || disabled;

  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current/25 border-t-current"
        />
      )}
      {children}
    </button>
  );
});

export default Button;