import type { Region } from "./types";

export interface RegionWithLabel extends Region {
  // Direction du tooltip Leaflet pour éviter les chevauchements
  // entre marqueurs proches (Cantley/Chelsea notamment).
  labelDir: "top" | "bottom" | "left" | "right";
}

// Secteurs principaux couverts par Vyncent (Outaouais).
export const REGIONS: RegionWithLabel[] = [
  { id: "la-peche",       name: "La Pêche",       lat: 45.7200, lng: -75.9400, labelDir: "top" },
  { id: "val-des-monts",  name: "Val-des-Monts",  lat: 45.6250, lng: -75.5550, labelDir: "top" },
  { id: "thurso",         name: "Thurso",         lat: 45.6010, lng: -75.2460, labelDir: "right" },
  { id: "cantley",        name: "Cantley",        lat: 45.5720, lng: -75.7890, labelDir: "top" },
  { id: "lange-gardien",  name: "L'Ange-Gardien", lat: 45.5550, lng: -75.4820, labelDir: "right" },
  { id: "chelsea",        name: "Chelsea",        lat: 45.5100, lng: -75.7830, labelDir: "bottom" },
  { id: "pontiac",        name: "Pontiac",        lat: 45.4930, lng: -76.0450, labelDir: "left" },
];

// Centre approximatif pour la carte de fond (décorative).
export const REGION_CENTER: [number, number] = [45.59, -75.66];

// Bounds englobant tous les secteurs avec padding pour la carte interactive.
export const REGION_BOUNDS: [[number, number], [number, number]] = [
  [45.46, -76.13], // sud-ouest
  [45.76, -75.18], // nord-est
];
