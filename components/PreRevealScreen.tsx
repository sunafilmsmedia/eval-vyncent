"use client";

import { motion } from "framer-motion";

interface Props {
  onContinue: () => void;
}

export default function PreRevealScreen({ onContinue }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 sm:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full text-center"
      >
        {/* Icône check */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 160, damping: 14 }}
          className="mx-auto mb-7 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400/30 to-[var(--color-brand-500)]/20 border border-emerald-400/40 flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(58,109,255,0.4)]"
        >
          <svg className="w-7 h-7 text-emerald-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 10L8 14L16 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-brand-300)] mb-3">
          Analyse complète
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--color-brand-100)] leading-[1.05] tracking-tight text-balance">
          Ta réponse est prête.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed text-balance max-w-md mx-auto">
          Avant de voir la réponse, veux-tu recevoir une analyse gratuite de ta propriété ?
        </p>

        {/* Bouton primaire — option recommandée */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onClick={onContinue}
          className="
            group mt-10 w-full
            relative overflow-hidden
            rounded-2xl
            bg-gradient-to-b from-[var(--color-brand-500)] to-[var(--color-brand-700)]
            text-white
            px-6 py-5
            shadow-[0_20px_50px_-15px_rgba(58,109,255,0.6)]
            hover:shadow-[0_25px_60px_-10px_rgba(58,109,255,0.7)]
            hover:-translate-y-0.5
            transition-all duration-300
          "
        >
          <span className="block font-medium text-base sm:text-lg">
            Oui, je veux voir la réponse
          </span>
          <span className="block text-xs sm:text-sm text-[var(--color-brand-100)]/80 mt-1">
            Reçois ton analyse par téléphone
          </span>
          <svg
            className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform group-hover:translate-x-1"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        {/* Bouton secondaire — petit, soft */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onClick={onContinue}
          className="
            mt-6 mx-auto
            text-xs sm:text-sm text-slate-500
            hover:text-slate-300
            transition-colors
            underline underline-offset-4 decoration-white/15
            block
          "
        >
          Non, je veux juste savoir si c&apos;est le bon moment
        </motion.button>
      </motion.div>
    </div>
  );
}
