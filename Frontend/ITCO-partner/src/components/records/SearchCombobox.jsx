import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";

export default function SearchCombobox({
  options,
  value,
  onChange,
  disabled,
  loading = false,
  placeholder = "Search...",
  emptyMessage = "No results found.",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const optionRefs = useRef([]);

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [value, options]
  );

  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options.slice(0, 50);
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 50);
  }, [query, options]);

  // Keep the highlighted row in sync whenever the visible result set changes.
  useEffect(() => {
    setHighlightedIndex(filtered.length > 0 ? 0 : -1);
  }, [filtered]);

  const closeAndRevert = () => {
    setOpen(false);
    setQuery(selectedLabel);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        closeAndRevert();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLabel]);

  // Scroll the active option into view when navigating with the keyboard.
  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

  const handleSelect = (option) => {
    setQuery(option.label);
    setOpen(false);
    setHighlightedIndex(-1);
    onChange({ target: { value: option.value } });
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) onChange({ target: { value: "" } });
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (filtered.length === 0) return;
      setHighlightedIndex((prev) => (prev + 1) % filtered.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (filtered.length === 0) return;
      setHighlightedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      return;
    }

    if (e.key === "Enter") {
      if (!open) return;
      e.preventDefault();
      const option = filtered[highlightedIndex];
      if (option) handleSelect(option);
      return;
    }

    if (e.key === "Escape") {
      if (!open) return;
      e.preventDefault();
      closeAndRevert();
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={[
            "w-full rounded-xl border bg-white py-2.5 pl-9 pr-9 text-sm text-slate-900 shadow-sm",
            "placeholder:text-slate-400 outline-none transition duration-150",
            "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          ].join(" ")}
        />

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : (
            <ChevronDown
              className={[
                "h-4 w-4 text-slate-400 transition-transform duration-150",
                open ? "rotate-180" : "",
              ].join(" ")}
            />
          )}
        </div>
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-70 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-xl ring-1 ring-black/5"
        >
          {loading ? (
            <li className="flex items-center gap-2 px-3.5 py-3 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </li>
          ) : filtered.length > 0 ? (
            filtered.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={option.value}
                  ref={(el) => (optionRefs.current[index] = el)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={[
                    "flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 transition-colors",
                    isHighlighted ? "bg-blue-50 text-blue-700" : "text-slate-700",
                  ].join(" ")}
                >
                  <div className="flex flex-col">
  <span className="font-medium text-slate-800">
    {option.label}
  </span>

  {option.raw?.propNumber && (
    <span className="text-xs text-slate-500">
      Property No.: {option.raw.propNumber}
    </span>
  )}

  {option.raw?.balQty != null && (
    <span
      className={`text-xs font-semibold ${
        Number(option.raw.balQty) <= 3
          ? "text-red-600"
          : "text-green-600"
      }`}
    >
      Available:
      {" "}
      {option.raw.balQty}
      {" "}
      {option.raw.unit || ""}
    </span>
  )}
</div>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-blue-600" />
                  )}
                </li>
              );
            })
          ) : (
            <li className="px-3.5 py-3 text-slate-400">{emptyMessage}</li>
          )}
        </ul>
      )}
    </div>
  );
} 