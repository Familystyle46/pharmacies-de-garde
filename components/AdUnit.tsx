"use client";

import { useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-2505467818694115";

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
      try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense bloqué par un adblocker — silencieux */
    }
  }, []);

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
