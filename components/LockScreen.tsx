"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  expectedCode: string;
  onUnlock: () => void;
}

export default function LockScreen({ expectedCode, onUnlock }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const attempt = () => {
    if (code.trim() === expectedCode) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm text-center"
      >
        {/* Cadenas */}
        <motion.div
          animate={shake ? { x: [-6, 6, -4, 4, -2, 2, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-8 w-20 h-20 relative"
        >
          <div className="absolute inset-0 rounded-full bg-[var(--color-brand-500)]/20 blur-2xl" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-brand-700)] to-[var(--color-brand-900)] border border-white/10 flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(58,109,255,0.4)]">
            <svg className="w-9 h-9 text-[var(--color-brand-200)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7.5C8 5.5 9.8 4 12 4C14.2 4 16 5.5 16 7.5V11" />
              <circle cx="12" cy="16" r="1.2" fill="currentColor" />
            </svg>
          </div>
        </motion.div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-brand-300)] mb-3">
          Accès restreint
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[var(--color-brand-100)] leading-tight tracking-tight text-balance">
          Site verrouillé
        </h1>
        <p className="mt-4 text-sm text-slate-400 leading-relaxed">
          Cette application n&apos;est pas encore disponible.
          Contacte l&apos;équipe qui l&apos;a développée pour obtenir ton code d&apos;accès.
        </p>

        <div className="mt-8">
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") attempt();
            }}
            placeholder="Code d'accès"
            className={`
              w-full glass-card rounded-xl px-4 py-3.5
              text-white text-center text-lg tracking-[0.4em]
              placeholder:text-white/25 placeholder:tracking-normal placeholder:text-sm
              focus-within:border-[var(--color-brand-400)]/60
              transition-colors
              ${error ? "border-rose-500/60" : ""}
            `}
            autoComplete="off"
          />
          {error && (
            <p className="text-xs text-rose-400 mt-2">Code incorrect.</p>
          )}
        </div>

        <button
          type="button"
          onClick={attempt}
          className="
            mt-4 w-full
            inline-flex items-center justify-center gap-2
            px-6 py-3 rounded-full text-sm font-medium
            bg-gradient-to-b from-[var(--color-brand-500)] to-[var(--color-brand-700)]
            text-white
            shadow-[0_15px_40px_-10px_rgba(58,109,255,0.5)]
            hover:shadow-[0_20px_50px_-10px_rgba(58,109,255,0.65)]
            transition-all
          "
        >
          Débloquer
        </button>
      </motion.div>
    </div>
  );
}
