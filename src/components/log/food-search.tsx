"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  servingSize: number | null;
  servingUnit: string | null;
}

interface FoodSearchProps {
  onSelect: (item: FoodItem) => void;
}

/**
 * Search input with dropdown autocomplete for food items.
 * Debounced — fetches from /api/food-items?q=
 */
export function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/food-items?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
          setOpen(true);
        }
      } catch {
        // silent error
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelect(item: FoodItem) {
    setQuery(item.name);
    setOpen(false);
    onSelect(item);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        )}
        {!loading && query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
          >
            <X size={14} />
          </button>
        )}
        <input
          type="text"
          placeholder="Cari makanan... (mis. nasi putih)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-10 pr-10"
          autoComplete="off"
          id="food-search-input"
        />
      </div>

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full top-full mt-1 bg-white border border-border rounded-[16px] shadow-lg overflow-hidden max-h-60 overflow-y-auto">
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-3 text-left hover:bg-primary-soft-bg transition-colors flex items-center justify-between"
              >
                <span className="text-sm font-medium text-text-dark">{item.name}</span>
                <span className="text-xs text-text-muted ml-2 flex-shrink-0">
                  {item.caloriesPer100g} kcal/100g
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 w-full top-full mt-1 bg-white border border-border rounded-[16px] shadow-lg px-4 py-3">
          <p className="text-sm text-text-muted">Makanan tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}
