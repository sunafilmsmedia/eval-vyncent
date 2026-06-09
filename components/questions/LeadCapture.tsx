"use client";

import { motion } from "framer-motion";

export interface LeadFields {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

interface Props {
  value: LeadFields;
  onChange: (v: LeadFields) => void;
}

export default function LeadCapture({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          rounded-2xl border border-[var(--color-gold)]/40
          bg-gradient-to-br from-[var(--color-gold)]/[0.08] to-transparent
          p-5
        "
      >
        <div className="flex gap-3">
          <svg className="w-5 h-5 shrink-0 text-[var(--color-gold)] mt-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 2 L17 6 L17 11 C17 14.5 14 17.5 10 18 C6 17.5 3 14.5 3 11 L3 6 Z" strokeLinejoin="round" />
            <path d="M7 10 L9.5 12.5 L14 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm text-[var(--color-gold-soft)] leading-relaxed">
            <strong className="text-[var(--color-gold)] font-medium">Notre promesse.</strong>{" "}
            Si l&apos;analyse conclut que ce n&apos;est pas le bon moment pour vendre, tes
            coordonnées seront automatiquement supprimées de notre base de données. Aucun
            courtier ne te contactera.
          </p>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field
          label="Prénom et nom"
          required
          autoComplete="name"
          value={value.name}
          onChange={(v) => onChange({ ...value, name: v })}
          placeholder="Marie Tremblay"
        />
        <Field
          label="Téléphone"
          required
          type="tel"
          autoComplete="tel"
          value={value.phone}
          onChange={(v) => onChange({ ...value, phone: v })}
          placeholder="(819) 555-0123"
        />
      </div>

      <Field
        label="Courriel"
        type="email"
        autoComplete="email"
        value={value.email}
        onChange={(v) => onChange({ ...value, email: v })}
        placeholder="marie@exemple.ca"
        helper="Optionnel — utilisé uniquement si on ne peut te joindre par téléphone."
      />

      <label className="flex items-start gap-3 cursor-pointer group select-none mt-2">
        <span className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={value.consent}
            onChange={(e) => onChange({ ...value, consent: e.target.checked })}
            className="peer sr-only"
          />
          <span className="block w-5 h-5 rounded-md border border-white/20 bg-white/[0.04] peer-checked:bg-[var(--color-brand-500)] peer-checked:border-[var(--color-brand-400)] transition-colors" />
          <svg className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6.5L4.5 9L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          J&apos;accepte que mes informations soient utilisées par Vyncent Ledoux pour me
          contacter à propos de mon évaluation, dans le respect de la promesse ci-dessus.
        </span>
      </label>
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
  helper?: string;
}

function Field({ label, value, onChange, placeholder, type = "text", required, autoComplete, helper }: FieldProps) {
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
      {helper && <p className="text-[11px] text-slate-500 mt-1.5">{helper}</p>}
    </div>
  );
}
