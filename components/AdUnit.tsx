"use client";

import { useEffect, useRef } from "react";

// Remplace par ton Publisher ID AdSense : ca-pub-XXXXXXXXXXXXXXXXX
const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-XXXXXXXXXXXXXXXXX";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  layout?: string;
  className?: string;
  style?: React.CSSProperties;
  // Si true, entoure l'annonce d'un label "Annonce" discret
  showLabel?: boolean;
}

export function AdUnit({
  slot,
  format = "auto",
  layout,
  className = "",
  style,
  showLabel = true,
}: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    // Ne pas afficher en dev si pas encore de vrai client ID
    if (AD_CLIENT === "ca-pub-XXXXXXXXXXXXXXXXX") return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense bloqué par un adblocker — silencieux */
    }
  }, []);

  // En dev ou sans publisher ID : placeholder visible pour la mise en page
  if (AD_CLIENT === "ca-pub-XXXXXXXXXXXXXXXXX") {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400 ${className}`}
        style={{ minHeight: 90, ...style }}
      >
        📢 Emplacement publicitaire
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabel && (
        <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400 text-center">
          Annonce
        </p>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </div>
  );
}
