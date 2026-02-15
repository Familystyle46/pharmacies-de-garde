"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { getVillesSuggestions, type VilleSuggestion } from "@/lib/pharmacies";

export function SearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<VilleSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await getVillesSuggestions(query);
      setSuggestions(results);
      setSelectedIndex(-1);
      setIsOpen(results.length > 0);
    } catch {
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, fetchSuggestions]);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigateToVille(suggestion: VilleSuggestion) {
    router.push(`/pharmacie-de-garde/${suggestion.ville_slug}`);
    setValue("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    if (suggestions.length > 0 && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      navigateToVille(suggestions[selectedIndex]);
      return;
    }
    if (suggestions.length > 0) {
      navigateToVille(suggestions[0]);
      return;
    }
    const slug = q
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (slug) router.push(`/pharmacie-de-garde/${slug}`);
    setValue("");
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          navigateToVille(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }

  const depDisplay = (s: VilleSuggestion) =>
    s.departement || s.code_postal?.slice(0, 2) || "";

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex overflow-hidden rounded-full bg-white shadow-xl ring-2 ring-transparent focus-within:ring-primary focus-within:ring-2 transition-shadow"
        role="search"
      >
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Votre ville ou code postal..."
          className="flex-1 border-0 outline-none px-6 py-4 text-base text-gray-900 bg-transparent"
          aria-label="Rechercher une ville"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="search-suggestions"
          aria-activedescendant={
            selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
          }
        />
        <button
          type="submit"
          className="bg-primary text-white border-0 px-6 py-4 text-[15px] font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap hover:bg-primary-hover transition-colors"
        >
          {isLoading ? "…" : "🔍"} Rechercher
        </button>
      </form>

      {isOpen && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 py-2 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[280px] overflow-auto z-50"
          aria-label="Suggestions de villes"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.ville_slug}-${s.code_postal}-${i}`}
              role="option"
              id={`suggestion-${i}`}
              aria-selected={i === selectedIndex}
              onClick={() => navigateToVille(s)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`px-4 py-3 cursor-pointer flex items-baseline justify-between gap-3 transition-colors ${
                i === selectedIndex ? "bg-green-100" : "hover:bg-green-50"
              }`}
            >
              <span className="font-medium text-gray-900 truncate">{s.ville}</span>
              {(depDisplay(s) && (
                <span className="text-sm text-gray-500 flex-shrink-0">
                  ({depDisplay(s)})
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
