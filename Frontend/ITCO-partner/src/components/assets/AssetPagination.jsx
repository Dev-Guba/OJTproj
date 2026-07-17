export default function AssetPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3">

      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
      >
        Previous
      </button>


      <span className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </span>


      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
      >
        Next
      </button>

    </div>
  );
}