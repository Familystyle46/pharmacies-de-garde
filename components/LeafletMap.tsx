"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Point {
  lat: number;
  lng: number;
  nom: string;
  telephone?: string;
}

interface LeafletMapProps {
  points: Point[];
  center: [number, number];
  zoom: number;
}

export default function LeafletMap({ points, center, zoom }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    const map = L.map(mapRef.current).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Croix médicale verte (marker personnalisé)
    const icon = L.divIcon({
      className: "custom-marker medical-cross",
      html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a" stroke="white" stroke-width="2" stroke-linecap="round">
        <rect x="10" y="4" width="4" height="16" rx="1"/>
        <rect x="4" y="10" width="16" height="4" rx="1"/>
      </svg>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    for (const p of points) {
      const popupContent = p.telephone
        ? `<strong>${p.nom}</strong><br><a href="tel:${p.telephone.replace(/\s/g, "")}">${p.telephone}</a>`
        : p.nom;
      L.marker([p.lat, p.lng], { icon }).bindPopup(popupContent).addTo(map);
    }

    mapInstance.current = map;
    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [center, zoom, points]);

  return <div ref={mapRef} className="h-[400px] w-full rounded-xl" />;
}
