"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { AnalyzeResponse, Answers, Verdict } from "@/lib/types";
import ContactForm from "./ContactForm";

interface Props {
  analyze: AnalyzeResponse;
  answers: Answers;
  onRestart: () => void;
}

const VERDICT_META: Record<Verdict, { label: string; color: string; bg: string; ring: string }> = {
  favorable: {
    label: "Moment favorable",
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
  },
  moyen: {
    label: "Moment neutre",
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
  },
  defavorable: {
    label: "Moment défavorable",
    color: "text-rose-300",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/30",
  },
};

type SubmissionState =
  | { kind: "pending" }
  | { kind: "done"; stored: boolean; firstName: string };

export default function ResultsScreen({ analyze, answers, onRestart }: Props) {
  const { scoring, report } = analyze;
  const meta = VERDICT_META[scoring.verdict];
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "pending" });

  return (
    <div className="min-h-screen px-5 sm:px-8 py-10 sm:py-14 max-w-3xl mx-auto w-full">
      {/* Verdict badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-8"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${meta.bg} ring-1 ${meta.ring}`}>
          <span className={`w-2 h-2 rounded-full ${meta.color.replace("text-", "bg-")}`} />
          <span className={`text-xs font-medium tracking-wide ${meta.color}`}>{meta.label}</span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--color-brand-100)] leading-[1.15] tracking-tight text-balance">
          {report.headline}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed text-balance max-w-2xl mx-auto">
          {report.summary}
        </p>
      </motion.div>

      {/* Score card */}
      <ScoreCard score={scoring.score} verdict={scoring.verdict} />

      {/* Mention discrète sous la note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="text-center text-[11px] sm:text-xs text-slate-500 italic mt-3 mb-1"
      >
        Un courtier t&apos;appellera pour confirmer les résultats.
      </motion.p>

      {/* Stats secondaires — juste sous la note */}
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        {report.stats.slice(1, 4).map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.07 }}
            className="glass-card rounded-2xl p-5"
          >
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="font-serif text-2xl text-[var(--color-brand-100)] mt-1">{s.value}</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Étape de capture (ou confirmation) — juste après les stats */}
      {submission.kind === "pending" ? (
        <ContactForm
          answers={answers}
          verdict={scoring.verdict}
          onSubmitted={(r) => setSubmission({ kind: "done", ...r })}
        />
      ) : (
        <ConfirmationBlock stored={submission.stored} firstName={submission.firstName} />
      )}

      {/* Market insight */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="
          mt-12
          rounded-2xl
          bg-gradient-to-br from-[var(--color-brand-500)]/10 to-[var(--color-brand-700)]/10
          border border-[var(--color-brand-400)]/20
          p-5 sm:p-6
        "
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-brand-500)]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--color-brand-300)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 2 L18 18 L2 18 Z" strokeLinejoin="round" />
              <path d="M10 8 V13 M10 15.5 V15.6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-brand-300)] mb-1.5">
              Donnée du marché
            </p>
            <p className="text-sm sm:text-base text-[var(--color-brand-100)] leading-relaxed">
              {report.marketInsight}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Facteurs détectés */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="mt-10"
      >
        <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-4">
          Facteurs détectés
        </h3>
        <ul className="space-y-2">
          {scoring.factors.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span
                className={`shrink-0 w-2 h-2 rounded-full ${
                  f.tone === "positive"
                    ? "bg-emerald-400"
                    : f.tone === "negative"
                    ? "bg-rose-400"
                    : "bg-slate-500"
                }`}
              />
              <span className="text-slate-300">{f.label}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Étapes */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="mt-12"
      >
        <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-5">
          Prochaines étapes
        </h3>
        <ol className="space-y-3">
          {report.steps.map((s, i) => (
            <li key={i} className="glass-card rounded-2xl p-4 sm:p-5 flex gap-4">
              <span className="
                shrink-0 w-8 h-8 rounded-full
                bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)]
                flex items-center justify-center
                font-serif text-white text-sm
                shadow-[0_6px_18px_-4px_rgba(58,109,255,0.5)]
              ">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-[var(--color-brand-100)]">{s.title}</p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* Footer */}
      <div className="mt-12 mb-24 sm:mb-12 text-center">
        <button
          onClick={onRestart}
          className="text-sm text-slate-400 hover:text-[var(--color-brand-200)] transition-colors underline underline-offset-4 decoration-white/15 hover:decoration-[var(--color-brand-400)]"
        >
          Refaire une évaluation
        </button>
        <p className="mt-6 text-[10px] text-slate-600 uppercase tracking-[0.2em]">
          Analyse {analyze.generatedBy === "claude" ? "IA" : "déterministe"} · Vyncent Ledoux · Outaouais
        </p>
      </div>
    </div>
  );
}

function ConfirmationBlock({ stored, firstName }: { stored: boolean; firstName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        mt-12 rounded-3xl p-6 sm:p-8
        ${stored
          ? "bg-gradient-to-br from-emerald-500/15 to-[var(--color-brand-900)]/30 border border-emerald-400/30"
          : "bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent border border-[var(--color-gold)]/30"}
      `}
    >
      {stored ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-emerald-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7L10 3L17 7M3 7V15A2 2 0 0 0 5 17H15A2 2 0 0 0 17 15V7M3 7L10 11L17 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-serif text-xl sm:text-2xl text-[var(--color-brand-100)]">
              Merci {firstName}, ton plan arrive.
            </p>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Tu vas recevoir tes démarches personnalisées par courriel dans les prochaines
            minutes. Vyncent ou un membre de son équipe pourrait aussi te joindre dans
            les 24 prochaines heures ouvrables si tu veux discuter de ton dossier. Aucune
            pression — juste une conversation honnête quand tu seras prêt.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[var(--color-gold)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 2 L17 6 L17 11 C17 14.5 14 17.5 10 18 C6 17.5 3 14.5 3 11 L3 6 Z" strokeLinejoin="round" />
              <path d="M7 10 L9.5 12.5 L14 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-serif text-xl sm:text-2xl text-[var(--color-gold-soft)]">
              Tes coordonnées ont été supprimées.
            </p>
          </div>
          <p className="text-sm sm:text-base text-[var(--color-gold-soft)]/85 leading-relaxed">
            Comme promis, puisque l&apos;analyse conclut que ce n&apos;est pas le bon moment
            pour vendre, ton nom, ton téléphone et ton courriel ont été automatiquement
            supprimés. Aucun courtier ne te contactera. Tu peux revenir nous voir quand tu
            seras prêt — l&apos;analyse reste à ta disposition ici.
          </p>
        </>
      )}
    </motion.div>
  );
}

function ScoreCard({ score, verdict }: { score: number; verdict: Verdict }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="
        relative overflow-hidden
        rounded-3xl p-7 sm:p-9
        bg-gradient-to-br from-[var(--color-brand-800)] via-[var(--color-brand-700)] to-[var(--color-brand-900)]
        shadow-[0_30px_80px_-30px_rgba(20,36,95,0.7),0_0_0_1px_rgba(255,255,255,0.06)_inset]
      "
    >
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[var(--color-brand-400)]/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />

      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-brand-200)]/80">
          Score d&apos;opportunité
        </p>
        <div className="flex items-baseline gap-2 mt-3">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-serif text-7xl sm:text-8xl text-white leading-none"
          >
            {score}
          </motion.span>
          <span className="font-serif text-2xl text-[var(--color-brand-200)]">/100</span>
        </div>

        <div className="mt-6 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`
              h-full rounded-full
              ${
                verdict === "favorable"
                  ? "bg-gradient-to-r from-emerald-300 to-emerald-400"
                  : verdict === "moyen"
                  ? "bg-gradient-to-r from-amber-300 to-amber-400"
                  : "bg-gradient-to-r from-rose-300 to-rose-400"
              }
            `}
          />
        </div>

        <p className="mt-4 text-sm text-[var(--color-brand-200)]/80">
          {verdict === "favorable"
            ? "Les conditions sont réunies pour envisager une mise en marché."
            : verdict === "moyen"
            ? "Quelques éléments à optimiser avant d'agir."
            : "Le moment actuel suggère la patience."}
        </p>
      </div>
    </motion.div>
  );
}
