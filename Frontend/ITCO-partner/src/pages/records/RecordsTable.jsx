import React from "react";
import Button from "../../components/ui/Button";

export default function RecordsTable({
  rows = [],
  sort,
  loading,
  canManageRecords,
  onSort,
  onEdit,
  onDelete,
}) {
  const SortIcon = ({ k }) =>
    sort?.key === k ? (
      <span className="text-amber-300 text-xs">
        {sort?.dir === "asc" ? "▲" : "▼"}
      </span>
    ) : (
      <span className="text-white/30 text-xs">▲</span>
    );

  const Th = ({ k, children, rowSpan = 1, colSpan = 1, className = "" }) => (
    <th
      rowSpan={rowSpan}
      colSpan={colSpan}
      onClick={k ? () => onSort?.(k) : undefined}
      className={[
        "px-3 py-3 text-left text-xs font-semibold whitespace-nowrap",
        "border border-[#162e4d]",
        "bg-[#1e3a5f] text-white",
        k ? "cursor-pointer select-none hover:bg-[#162e4d] transition-colors" : "",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {k && <SortIcon k={k} />}
      </div>
    </th>
  );

  const Td = ({ children, className = "" }) => (
    <td
      className={[
        "px-3 py-2.5 text-sm border border-slate-200 text-slate-700",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );

  const grouped = rows.reduce((acc, row) => {
    const officer = row.accountableOfficer || "No Officer";
    if (!acc[officer]) acc[officer] = [];
    acc[officer].push(row);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <Th k="article" rowSpan={2}>Article</Th>
            <Th k="description" rowSpan={2}>Description</Th>
            <Th k="propNumber" rowSpan={2}>Prop No.</Th>
            <Th k="dateAcquired" rowSpan={2}>Date Acquired</Th>
            <Th k="unit" rowSpan={2}>Unit</Th>
            <Th k="unitValue" rowSpan={2}>
              <span className="leading-tight">Unit<br />Value</span>
            </Th>
            <Th rowSpan={1} colSpan={2} className="text-center">
              Bal. per Stockcard
            </Th>
            <Th k="accountableOfficer" rowSpan={2}>Accountable Officer</Th>
            <Th k="areMeNo" rowSpan={2}>ARE / ME No.</Th>
            <Th k="office" rowSpan={2}>Office</Th>
            {canManageRecords && (
              <Th rowSpan={2} className="text-center">Actions</Th>
            )}
          </tr>
          <tr>
            <Th k="balQty" className="text-center">Qty</Th>
            <Th k="balValue" className="text-center">Value</Th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  {[...Array(canManageRecords ? 12 : 11)].map((__, j) => (
                    <td key={j} className="border border-slate-200 px-3 py-3">
                      <div className="h-3 animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={canManageRecords ? 12 : 11}
                className="px-4 py-12 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-8 w-8 text-slate-300"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span className="text-sm text-slate-400">No records found.</span>
                </div>
              </td>
            </tr>
          ) : (
            Object.entries(grouped).map(([officer, records]) => (
              <React.Fragment key={officer}>

                {/* Officer group header */}
                <tr>
                  <td
                    colSpan={canManageRecords ? 12 : 11}
                    className="border border-[#162e4d] bg-[#1e3a5f]/90 px-4 py-2 text-center text-sm font-semibold tracking-widest text-amber-300"
                    style={{ fontFamily: "'Cinzel', serif", letterSpacing: "3px" }}
                  >
                    {officer}
                  </td>
                </tr>

                {/* Records */}
                {records.map((record, i) => (
                  <tr
                    key={record.id}
                    className={[
                      "transition-colors hover:bg-blue-50/40",
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/60",
                    ].join(" ")}
                  >
                    <Td>{record.article ?? ""}</Td>
                    <Td>{record.description ?? ""}</Td>
                    <Td className="font-medium text-[#1e3a5f]">
                      {record.propNumber ?? ""}
                    </Td>
                    <Td>{record.dateAcquired ?? ""}</Td>
                    <Td>{record.unit ?? ""}</Td>
                    <Td>{record.unitValue ?? ""}</Td>
                    <Td className="text-center tabular-nums">{record.balQty ?? ""}</Td>
                    <Td className="text-center tabular-nums">{record.balValue ?? ""}</Td>
                    <Td>{record.accountableOfficer ?? ""}</Td>
                    <Td>
                      {record.areMeNo ? (
                        record.areMeNo
                      ) : (
                        <span className="text-xs text-amber-500">Missing</span>
                      )}
                    </Td>
                    <Td>{record.office ?? ""}</Td>
                    {canManageRecords && (
                      <Td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            aria-label={`Edit record ${record.propNumber}`}
                            onClick={() => onEdit?.(record.id)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            aria-label={`Delete record ${record.propNumber}`}
                            onClick={() => onDelete?.(record.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </Button>
                        </div>
                      </Td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}