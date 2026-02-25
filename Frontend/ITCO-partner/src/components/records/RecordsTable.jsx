import Button from "../ui/Button";

export default function RecordsTable({
  rows = [],
  sort,
  onSort,
  onEdit,
  onDelete,
}) {
  const SortIcon = ({ k }) =>
    sort?.key === k ? <span>{sort?.dir === "asc" ? "▲" : "▼"}</span> : null;

  const Th = ({ k, children, rowSpan = 1, colSpan = 1, className = "" }) => (
    <th
      rowSpan={rowSpan}
      colSpan={colSpan}
      onClick={k ? () => onSort?.(k) : undefined}
      className={[
        "px-4 py-3 text-left font-semibold whitespace-nowrap",
        "border border-gray-400",
        k ? "cursor-pointer select-none hover:text-gray-900" : "",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {k && <SortIcon k={k} />}
      </div>
    </th>
  );

  const Td = ({ children, className = "" }) => (
    <td className={["px-4 py-3 border border-gray-400", className].join(" ")}>
      {children}
    </td>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-400 w-full text-sm border border-gray-400 border-collapse">
        <thead className="bg-gray-50 text-gray-700">
  {/* Header Row 1 */}
  <tr>
    <Th k="article" rowSpan={2}>Article</Th>
    <Th k="description" rowSpan={2}>Description</Th>
    <Th k="propNumber" rowSpan={2}>Prop No.</Th>
    <Th k="dateAcquired" rowSpan={2}>Date Acquired</Th>
    <Th k="unit" rowSpan={2}>Unit</Th>

    <Th k="unitValue" rowSpan={2}>
      <span className="leading-tight">
        Unit <br />
        Value
      </span>
    </Th>

    <Th rowSpan={1} colSpan={2} className="text-center">
      Bal. per stockcard
    </Th>

    <Th k="accountableOfficer" rowSpan={2}>Accountable Officer</Th>
    <Th k="areMeNo" rowSpan={2}>ARE No. / ME No.</Th>
    <Th k="office" rowSpan={2}>Office</Th>
    <Th rowSpan={2} className="text-center">Actions</Th>
  </tr>

  {/* Header Row 2 */}
  <tr>
    <Th k="balQty" className="text-center">Qty</Th>
    <Th k="balValue" className="text-center">Value</Th>
  </tr>

  {/* ✅ Always-visible Info Row */}
  <tr>
  <th
    colSpan={12}
    className="h-10 bg-sky-200 text-red-700 text-2xl font-bold text-center px-4 py-0 leading-none"
    style={{ fontFamily: "'Cinzel', serif", letterSpacing: "2px" }}
  >
    ARLEE CARLOS (Information Technology Officer I)
  </th>
</tr>
</thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <Td>{item.article ?? ""}</Td>
                <Td>{item.description ?? ""}</Td>
                <Td className="font-medium">{item.propNumber ?? ""}</Td>
                <Td>{item.dateAcquired ?? ""}</Td>
                <Td>{item.unit ?? ""}</Td>
                <Td>{item.unitValue ?? ""}</Td>
                <Td className="text-center">{item.balQty ?? ""}</Td>
                <Td className="text-center">{item.balValue ?? ""}</Td>
                <Td>{item.accountableOfficer ?? ""}</Td>
                <Td>{item.areMeNo ?? ""}</Td>
                <Td>{item.office ?? ""}</Td>

                {/* Actions cell */}
                <Td className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => onEdit?.(item.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => onDelete?.(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}