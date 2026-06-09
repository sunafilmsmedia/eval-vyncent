"use client";

import { motion } from "framer-motion";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-16 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl text-center"
      >
        {/* Chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs sm:text-sm text-[var(--color-brand-200)] mb-7 sm:mb-9">
          <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--color-gold)] text-[var(--color-gold)] pulse-dot" />
          <span className="font-medium tracking-wide">Estimation personnalisée</span>
        </div>

        {/* Titre H1 */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[var(--color-brand-100)] leading-[1.05] tracking-tight text-balance">
          Est-ce le bon moment pour vendre votre propriété ?
        </h1>

        {/* Sous-titre */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed text-balance">
          Réponds à une dizaine de questions et reçois une analyse honnête et confidentielle
          de ton timing, basée sur ta plus-value, ton équité et ta situation.
        </p>

        {/* Hook signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 font-serif italic text-xl sm:text-2xl ai-shimmer inline-block"
        >
          Boosté par l&apos;IA
        </motion.p>

        {/* Divider doré */}
        <div className="mt-8 sm:mt-10 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-10 sm:mt-12 flex flex-col items-center gap-3"
        >
          <button
            onClick={onStart}
            className="
              group relative inline-flex items-center justify-center gap-2
              px-8 sm:px-10 py-4
              rounded-full
              bg-gradient-to-b from-[var(--color-brand-500)] to-[var(--color-brand-700)]
              text-white font-medium text-base
              shadow-[0_20px_50px_-15px_rgba(58,109,255,0.6),0_0_0_1px_rgba(255,255,255,0.08)_inset]
              hover:shadow-[0_25px_60px_-10px_rgba(58,109,255,0.7),0_0_0_1px_rgba(255,255,255,0.12)_inset]
              transition-all duration-300
              hover:-translate-y-0.5
              active:translate-y-0
            "
          >
            <span>Commencer mon évaluation</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-xs text-slate-500">3 minutes — gratuit et confidentiel</p>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 uppercase tracking-[0.2em]"
      >
        Confidentiel · Sans engagement
      </motion.div>
    </section>
  );
}
