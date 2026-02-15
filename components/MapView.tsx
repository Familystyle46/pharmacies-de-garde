"use client";

import dynamic from "next/dynamic";
import type { Pharmacie } from "@/lib/pharmacies";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[400px] w-full items-center justify-center rounded-2xl text-gray-500"
      style={{ background: "#e8f0e4", border: "2px solid #e5e7eb" }}
    >
      Chargement de la carte…
    </div>
  ),
});

interface MapViewProps {
  pharmacies: Pharmacie[];
  center?: [number, number];
  zoom?: number;
}

export function MapView({ pharmacies, center, zoom = 12 }: MapViewProps) {
  const points = pharmacies
    .filter((p) => p.latitude != null && p.longitude != null)
    .map((p) => ({ lat: p.latitude!, lng: p.longitude!, nom: p.nom, telephone: p.telephone }));

  const defaultCenter: [number, number] =
    center ?? (points[0] ? [points[0].lat, points[0].lng] : [48.8566, 2.3522]);

  return (
    <div
      className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200"
      style={{ background: "#e8f0e4" }}
    >
      <LeafletMap points={points} center={defaultCenter} zoom={zoom} />
    </div>
  );
}
