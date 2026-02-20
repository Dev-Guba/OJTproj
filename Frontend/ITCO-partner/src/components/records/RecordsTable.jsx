

export default function RecordsTable({
  rows = [],
  sort,
  onSort,

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
        "border border-black-600",
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
    <td className={["px-4 py-3 border border-black-600", className].join(" ")}>
      {children}
    </td>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-400 w-full text-sm border border-gray-300 border-collapse">
        <thead className="bg-gray-50 text-gray-700">
          {/* Header Row 1 */}
          <tr>
            {/* All single headers span 2 rows */}
            <Th k="article" rowSpan={2}>
              Article
            </Th>
            <Th k="description" rowSpan={2}>
              Description
            </Th>
            <Th k="propNumber" rowSpan={2}>
              Prop No.
            </Th>
            <Th k="dateAcquired" rowSpan={2}>
              Date Acquired
            </Th>

            <Th k="unit" rowSpan={2}>
              Unit
            </Th>

            {/* EXACT form-like styling: Unit Value displayed as 2 lines */}
            <Th k="unitValue" rowSpan={2}>
              <span className="leading-tight">
                Unit <br />
                Value
              </span>
            </Th>

            {/* Only this part is double header */}
            <Th rowSpan={1} colSpan={2} className="text-center">
              Bal. per stockcard
            </Th>

            <Th k="accountableOfficer" rowSpan={2}>
              Accountable Office
            </Th>
            <Th k="areMeNo" rowSpan={2}>
              ARE No. / ME No.
            </Th>
            <Th k="office" rowSpan={2}>
              Office
            </Th>
          </tr>

          {/* Header Row 2 (only for stockcard) */}
          <tr>
            <Th k="balQty">Qty</Th>
            <Th k="balValue">Value</Th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
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

                <Td>{item.balQty ?? ""}</Td>
                <Td>{item.balValue ?? ""}</Td>

                <Td>{item.accountableOfficer ?? ""}</Td>
                <Td>{item.areMeNo ?? ""}</Td>
                <Td>{item.office ?? ""}</Td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}