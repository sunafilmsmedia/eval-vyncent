import type { Region } from "./types";

// Zones de couverture autour de Gatineau / Outaouais.
export const REGIONS: Region[] = [
  { id: "hull", name: "Hull", lat: 45.4326, lng: -75.7338 },
  { id: "aylmer", name: "Aylmer", lat: 45.3938, lng: -75.8456 },
  { id: "gatineau-secteur", name: "Gatineau", lat: 45.4765, lng: -75.7013 },
  { id: "buckingham", name: "Buckingham", lat: 45.5847, lng: -75.4192 },
  { id: "chelsea", name: "Chelsea", lat: 45.5067, lng: -75.7833 },
  { id: "cantley", name: "Cantley", lat: 45.5717, lng: -75.7889 },
];

export const REGION_CENTER: [number, number] = [45.47, -75.71];
