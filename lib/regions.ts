import type { Region } from "./types";

export interface RegionWithLabel extends Region {
  // Direction du tooltip Leaflet pour éviter les chevauchements
  // entre marqueurs proches.
  labelDir: "top" | "bottom" | "left" | "right";
}

// Tous les secteurs couverts par Vyncent (Outaouais).
export const REGIONS: RegionWithLabel[] = [
  // Anciens secteurs
  { id: "aylmer",         name: "Aylmer",         lat: 45.3938, lng: -75.8456, labelDir: "bottom" },
  { id: "hull",           name: "Hull",           lat: 45.4326, lng: -75.7338, labelDir: "left" },
  { id: "gatineau",       name: "Gatineau",       lat: 45.4765, lng: -75.7013, labelDir: "right" },
  { id: "buckingham",     name: "Buckingham",     lat: 45.5847, lng: -75.4192, labelDir: "top" },
  // Nouveaux secteurs
  { id: "la-peche",       name: "La Pêche",       lat: 45.7200, lng: -75.9400, labelDir: "top" },
  { id: "val-des-monts",  name: "Val-des-Monts",  lat: 45.6250, lng: -75.5550, labelDir: "top" },
  { id: "thurso",         name: "Thurso",         lat: 45.6010, lng: -75.2460, labelDir: "right" },
  { id: "cantley",        name: "Cantley",        lat: 45.5720, lng: -75.7890, labelDir: "top" },
  { id: "lange-gardien",  name: "L'Ange-Gardien", lat: 45.5550, lng: -75.4820, labelDir: "bottom" },
  { id: "chelsea",        name: "Chelsea",        lat: 45.5100, lng: -75.7830, labelDir: "bottom" },
  { id: "pontiac",        name: "Pontiac",        lat: 45.4930, lng: -76.0450, labelDir: "left" },
];

// Centre approximatif pour la carte de fond (décorative).
export const REGION_CENTER: [number, number] = [45.56, -75.66];

// Bounds englobant tous les secteurs avec padding pour la carte interactive.
export const REGION_BOUNDS: [[number, number], [number, number]] = [
  [45.37, -76.13], // sud-ouest (englobe Aylmer)
  [45.76, -75.18], // nord-est (englobe La Pêche et Thurso)
];
