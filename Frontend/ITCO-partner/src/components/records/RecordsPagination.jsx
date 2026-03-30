import Button from "../ui/Button";

export default function RecordsPagination({
  page,
  totalPages,
  total,
  onFirst,
  onPrev,
  onNext,
  onLast,
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
      <div className="text-xs text-gray-500">
        Page {page} of {totalPages} • {total} record(s)
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" disabled={page === 1} onClick={onFirst}>
          First
        </Button>

        <Button variant="ghost" disabled={page === 1} onClick={onPrev}>
          Prev
        </Button>

        <Button
          variant="ghost"
          disabled={page === totalPages}
          onClick={onNext}
        >
          Next
        </Button>

        <Button
          variant="ghost"
          disabled={page === totalPages}
          onClick={onLast}
        >
          Last
        </Button>
      </div>
    </div>
  );
}