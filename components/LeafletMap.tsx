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

    const icon = L.divIcon({
      className: "custom-marker",
      html: `<span style="background:#16a34a;width:12px;height:12px;border-radius:50%;display:block;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></span>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
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
