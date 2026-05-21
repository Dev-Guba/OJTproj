export default function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-xl">
          📋
        </div>

        <div>
          <div className="text-base font-bold text-slate-900">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
          ) : null}
        </div>
      </div>

      <div className="px-6 py-5">{children}</div>
    </div>
  );
}