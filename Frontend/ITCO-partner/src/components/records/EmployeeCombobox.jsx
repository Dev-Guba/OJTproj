import { useState, useRef, useEffect, useMemo } from "react";

export default function EmployeeCombobox({
  options,
  value,
  onChange,
  disabled,
  placeholder = "Search employee...",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [value, options]
  );

  useEffect(() => { setQuery(selectedLabel); }, [selectedLabel]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options.slice(0, 50);
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 50);
  }, [query, options]);

  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (option) => {
    setQuery(option.label);
    setOpen(false);
    onChange({ target: { value: option.value } });
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) onChange({ target: { value: "" } });
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        disabled={disabled}
        className={[
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm",
          "placeholder:text-slate-400 outline-none transition duration-150",
          "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
        ].join(" ")}
      />

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg text-sm">
          {filtered.map((option) => (
            <li
              key={option.value}
              onMouseDown={() => handleSelect(option)}
              className="cursor-pointer px-3.5 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && query.trim() && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-400 shadow-lg">
          No employees found.
        </div>
      )}
    </div>
  );
}