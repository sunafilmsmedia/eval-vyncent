"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { REGIONS } from "@/lib/regions";
import type { Answers } from "@/lib/types";
import { trackPixel } from "./MetaPixel";

interface Props {
  answers: Answers;
  onRestart: () => void;
}

type State =
  | { kind: "form" }
  | { kind: "submitting" }
  | { kind: "done"; firstName: string };

export default function NoSellScreen({ answers, onRestart }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState(answers.region ?? "");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: "form" });

  const submit = async () => {
    setError(null);
    if (!name.trim()) return setError("Ton nom est requis.");
    if (!email.trim()) return setError("Ton courriel est requis.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError("Format de courriel invalide.");
    }
    if (!region) return setError("Choisis le secteur qui t'intéresse.");
    if (!consent) return setError("Merci de cocher la case de consentement.");

    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          consent,
          leadType: "market_info",
          answers: { ...answers, region },
        }),
      });
      if (!res.ok) throw new Error("Network");

      // Meta Pixel — événement Lead (subscriber au lieu d'évaluation)
      trackPixel("Lead", {
        content_category: "market_info_subscription",
        currency: "CAD",
      });

      setState({ kind: "done", firstName: name.trim().split(/\s+/)[0] });
    } catch {
      setError("Une erreur est survenue. Réessaie dans quelques secondes.");
      setState({ kind: "form" });
    }
  };

  if (state.kind === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-center"
        >
          <div className="mx-auto mb-8 w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 10L8 14L16 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--color-brand-100)] leading-tight text-balance">
            Merci {state.firstName}.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Tu vas recevoir nos analyses du marché de ton secteur directement par courriel.
            Aucun courtier ne va t&apos;appeler — c&apos;est juste pour t&apos;informer.
          </p>
          <button
            onClick={onRestart}
            className="mt-10 text-sm text-slate-400 hover:text-[var(--color-brand-200)] transition-colors underline underline-offset-4 decoration-white/15 hover:decoration-[var(--color-brand-400)]"
          >
            Retour à l&apos;accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 sm:px-8 py-12 sm:py-16 max-w-xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-[var(--color-brand-200)] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
          Pas de vente prévue
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--color-brand-100)] leading-[1.1] tracking-tight text-balance">
          Tu n&apos;es pas prêt à vendre.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed text-balance max-w-md mx-auto">
          Pas de souci — laisse-nous tes coordonnées si tu veux recevoir
          les ventes récentes et les tendances de ton secteur.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="
          mt-10
          rounded-3xl p-6 sm:p-8
          bg-gradient-to-br from-[var(--color-brand-700)]/25 to-[var(--color-brand-900)]/25
          border border-[var(--color-brand-400)]/25
          shadow-[0_30px_80px_-30px_rgba(20,36,95,0.5)]
        "
      >
        <div className="space-y-3">
          <Field
            label="Ton prénom"
            required
            autoComplete="given-name"
            value={name}
            onChange={setName}
            placeholder="Marie"
          />
          <Field
            label="Courriel"
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            placeholder="marie@exemple.ca"
          />
          <div>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5 block">
                Secteur d&apos;intérêt <span className="text-[var(--color-gold)]">*</span>
              </span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="
                  w-full glass-card rounded-xl px-4 py-3
                  text-white
                  focus-within:border-[var(--color-brand-400)]/60
                  transition-colors
                  text-base
                  appearance-none
                "
              >
                <option value="" className="bg-[var(--color-ink-900)]">
                  Choisir un secteur…
                </option>
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[var(--color-ink-900)]">
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group select-none mt-5">
          <span className="relative shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="peer sr-only"
            />
            <span className="block w-5 h-5 rounded-md border border-white/20 bg-white/[0.04] peer-checked:bg-[var(--color-brand-500)] peer-checked:border-[var(--color-brand-400)] transition-colors" />
            <svg
              className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 6.5L4.5 9L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            J&apos;accepte de recevoir les analyses de marché de Vyncent Ledoux par courriel.
            Aucun appel — uniquement de l&apos;information.
          </span>
        </label>

        {error && <p className="mt-3 text-sm text-rose-400 text-center">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={state.kind === "submitting"}
          className="
            mt-6 w-full
            inline-flex items-center justify-center gap-2
            px-6 py-4 rounded-full text-base font-medium
            bg-gradient-to-b from-[var(--color-brand-500)] to-[var(--color-brand-700)]
            text-white
            shadow-[0_15px_40px_-10px_rgba(58,109,255,0.55)]
            hover:shadow-[0_20px_50px_-10px_rgba(58,109,255,0.7)]
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all
          "
        >
          {state.kind === "submitting" ? "Envoi…" : "Recevoir les analyses du secteur"}
        </button>
      </motion.div>

      <div className="mt-10 text-center">
        <button
          onClick={onRestart}
          className="text-xs text-slate-500 hover:text-[var(--color-brand-200)] transition-colors"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

function Field({ label, value, onChange, placeholder, type = "text", required, autoComplete }: FieldProps) {
  return (
    <div>
      <label className="block">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5 block">
          {label} {required && <span className="text-[var(--color-gold)]">*</span>}
        </span>
        <input
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full glass-card rounded-xl px-4 py-3
            text-white placeholder:text-white/25
            focus-within:border-[var(--color-brand-400)]/60
            transition-colors
            text-base
          "
        />
      </label>
    </div>
  );
}
