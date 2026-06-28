export default function SectionCard({ title, subtitle, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {subtitle && (
            <div className="mt-0.5 text-xs text-slate-400">{subtitle}</div>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}