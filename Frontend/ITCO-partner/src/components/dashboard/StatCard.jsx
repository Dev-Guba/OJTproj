const icons = {
  records: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  value: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  offices: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="4" y="3" width="11" height="18" rx="1" />
      <path d="M15 8h5v13h-5" />
      <line x1="8" y1="7" x2="8" y2="7.01" />
      <line x1="11" y1="7" x2="11" y2="7.01" />
      <line x1="8" y1="11" x2="8" y2="11.01" />
      <line x1="11" y1="11" x2="11" y2="11.01" />
    </svg>
  ),
  admins: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.2c2.3.5 4 2.5 4 5.8" />
    </svg>
  ),
  employees: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  qty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
};

const colorMap = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100" },
  gold:   { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100" },
  green:  { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-100" },
  slate:  { bg: "bg-slate-100", text: "text-slate-500",  border: "border-slate-200" },
  navy:   { bg: "bg-[#e8eef6]", text: "text-[#1e3a5f]",  border: "border-[#c5d4e8]" },
};

export default function StatCard({
  label,
  value,
  hint,
  icon = "records",
  color = "blue",
}) {
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={[
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl border",
            c.bg, c.text, c.border,
          ].join(" ")}
        >
          {icons[icon] ?? icons.records}
        </div>

        <div className="min-w-0 flex-1 text-right">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </div>
          <div className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">
            {value}
          </div>
          {hint && (
            <div className="mt-1 text-xs text-slate-400">{hint}</div>
          )}
        </div>
      </div>
    </div>
  );
}