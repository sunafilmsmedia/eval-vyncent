"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, useMapEvents } from "react-leaflet";
import { REGIONS, REGION_BOUNDS } from "@/lib/regions";

interface Props {
  value?: string;
  onChange: (id: string) => void;
}

function nearestRegionId(lat: number, lng: number): string {
  let nearestId = REGIONS[0].id;
  let minSq = Infinity;
  for (const r of REGIONS) {
    const dLat = r.lat - lat;
    const dLng = r.lng - lng;
    const sq = dLat * dLat + dLng * dLng;
    if (sq < minSq) {
      minSq = sq;
      nearestId = r.id;
    }
  }
  return nearestId;
}

function ClickHandler({ onPick }: { onPick: (id: string) => void }) {
  useMapEvents({
    click: (e) => {
      onPick(nearestRegionId(e.latlng.lat, e.latlng.lng));
    },
  });
  return null;
}

function tooltipOffset(dir: "top" | "bottom" | "left" | "right"): [number, number] {
  switch (dir) {
    case "top":    return [0, -10];
    case "bottom": return [0, 10];
    case "left":   return [-12, 0];
    case "right":  return [12, 0];
  }
}

export default function RegionMapInner({ value, onChange }: Props) {
  return (
    <MapContainer
      bounds={REGION_BOUNDS}
      boundsOptions={{ padding: [40, 40] }}
      minZoom={9}
      maxZoom={13}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%", cursor: "pointer" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap, &copy; CARTO'
        subdomains={["a", "b", "c", "d"]}
      />
      <ClickHandler onPick={onChange} />
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
              direction={r.labelDir}
              offset={tooltipOffset(r.labelDir)}
              className="region-label"
            >
              {r.name}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
