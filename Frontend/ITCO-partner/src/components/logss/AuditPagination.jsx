export default function AuditPagination() {
  return (
    <div className="bg-white rounded-xl shadow border p-4 flex justify-between items-center">

      <p className="text-gray-500 text-sm">
        Showing 1–10 of 143 logs
      </p>

      <div className="flex gap-2">

        <button className="border px-4 py-2 rounded-lg">
          Previous
        </button>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          1
        </button>

        <button className="border px-4 py-2 rounded-lg">
          2
        </button>

        <button className="border px-4 py-2 rounded-lg">
          Next
        </button>

      </div>

    </div>
  );
}