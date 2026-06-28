import Button from "../ui/Button";

export default function RecordsPagination({ page, totalPages, total, onFirst, onPrev, onNext, onLast }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3">
      <span className="text-xs text-slate-400">
        Page <span className="font-medium text-slate-600">{page}</span> of{" "}
        <span className="font-medium text-slate-600">{totalPages}</span>
        <span className="mx-1.5 text-slate-300">·</span>
        <span className="font-medium text-slate-600">{total}</span> record(s)
      </span>

      <div className="flex gap-1">
        {[
          { label: "First", onClick: onFirst, disabled: page === 1 },
          { label: "Prev",  onClick: onPrev,  disabled: page === 1 },
          { label: "Next",  onClick: onNext,  disabled: page === totalPages },
          { label: "Last",  onClick: onLast,  disabled: page === totalPages },
        ].map(({ label, onClick, disabled }) => (
          <Button key={label} variant="ghost" size="sm" disabled={disabled} onClick={onClick}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}