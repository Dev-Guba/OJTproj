import { useState, useRef, useEffect, useMemo } from "react";

export default function EmployeeCombobox({
  options,        // [{ value, label, raw }]
  value,          // currently selected value (EmployeeId string)
  onChange,       // (e) => void  — emits a synthetic { target: { value } }
  disabled,
  placeholder = "Search employee...",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // When the parent sets a value (e.g. on edit load), sync the display label
  const selectedLabel = useMemo(() => {
    const match = options.find((o) => o.value === value);
    return match ? match.label : "";
  }, [value, options]);

  // Keep input text in sync when selected value changes externally
  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options.slice(0, 50); // cap for perf
    const q = query.toLowerCase();
    return options
      .filter((o) => o.label.toLowerCase().includes(q))
      .slice(0, 50);
  }, [query, options]);

  // Close on outside click
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
    // If user clears the field, also clear the selection
    if (!e.target.value) onChange({ target: { value: "" } });
  };

  const handleFocus = () => setOpen(true);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        disabled={disabled}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded shadow-lg text-sm">
          {filtered.map((option) => (
            <li
              key={option.value}
              className="px-3 py-2 cursor-pointer hover:bg-blue-50"
              onMouseDown={() => handleSelect(option)}  // mousedown fires before blur
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && query.trim() && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg text-sm px-3 py-2 text-gray-400">
          No employees found
        </div>
      )}
    </div>
  );
}