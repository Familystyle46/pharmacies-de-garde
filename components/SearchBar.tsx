"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (!q) return;
    const slug = q.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/\p{Diacritic}/gu, "");
    router.push(`/pharmacie-de-garde/${slug}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[520px] overflow-hidden rounded-[14px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <input
        ref={inputRef}
        type="search"
        name="q"
        placeholder="Votre ville ou code postal..."
        className="flex-1 border-0 outline-none px-5 py-4 text-[15px] text-gray-900 bg-transparent"
        aria-label="Rechercher une ville"
      />
      <button
        type="submit"
        className="bg-primary text-white border-0 px-6 py-4 text-[15px] font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
      >
        🔍 Rechercher
      </button>
    </form>
  );
}
