"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrokerBadge() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="
        fixed z-40
        bottom-4 left-4 right-4
        sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-[280px]
        rounded-2xl glass-card-light
        px-4 py-3
        flex items-center gap-3
      "
      aria-label="Courtier disponible"
    >
      <div className="relative shrink-0">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 ring-2 ring-white shadow-md">
          <Image
            src="/vyncent.png"
            alt="Vyncent Ledoux"
            fill
            sizes="56px"
            className="object-cover"
            style={{ objectPosition: "60% 12%" }}
            priority
          />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">Disponible</span>
        </div>
        <p className="text-sm font-semibold text-slate-900 truncate font-serif leading-tight mt-0.5">
          Vyncent Ledoux
        </p>
        <p className="text-[11px] sm:text-xs text-slate-500 truncate">
          Courtier immobilier — Outaouais
        </p>
      </div>
    </motion.aside>
  );
}
