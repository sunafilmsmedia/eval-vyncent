"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { REGIONS, REGION_CENTER } from "@/lib/regions";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });

interface Props {
  value?: string;
  onChange: (id: string) => void;
}

export default function RegionMap({ value, onChange }: Props) {
  // Force Leaflet icons fix (not strictly needed for CircleMarker, but safe)
  useEffect(() => {
    import("leaflet").then((L) => {
      // no-op
      void L;
    });
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_rgba(20,36,95,0.6)]">
        <MapContainer
          center={REGION_CENTER}
          zoom={10}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap, &copy; CARTO'
            subdomains={["a", "b", "c", "d"]}
          />
          {REGIONS.map((r) => {
            const selected = value === r.id;
            return (
              <CircleMarker
                key={r.id}
                center={[r.lat, r.lng]}
                radius={selected ? 14 : 9}
                pathOptions={{
                  color: selected ? "#1d3eb3" : "#3a6dff",
                  weight: selected ? 3 : 2,
                  opacity: 1,
                  fillColor: selected ? "#3a6dff" : "#ffffff",
                  fillOpacity: selected ? 0.95 : 0.85,
                }}
                eventHandlers={{
                  click: () => onChange(r.id),
                }}
              >
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -10]}
                  className="region-label"
                >
                  {r.name}
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 text-center">
        {value
          ? `Secteur sélectionné : ${REGIONS.find((r) => r.id === value)?.name}`
          : "Touche un marqueur pour sélectionner ton secteur."}
      </p>
    </div>
  );
}
