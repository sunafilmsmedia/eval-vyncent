import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import Clarity from "@/components/Clarity";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Vyncent Ledoux — Est-ce le bon moment pour vendre ?",
  description:
    "Une estimation personnalisée, propulsée par l'intelligence artificielle, pour savoir si le moment est favorable à la vente de votre propriété en Outaouais.",
  metadataBase: new URL("https://vyncentledoux.example"),
  openGraph: {
    title: "Est-ce le bon moment pour vendre votre propriété ?",
    description: "Estimation personnalisée — Vyncent Ledoux, courtier immobilier en Outaouais.",
    locale: "fr_CA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen antialiased">
        <MetaPixel />
        <Clarity />
        {children}
      </body>
    </html>
  );
}
