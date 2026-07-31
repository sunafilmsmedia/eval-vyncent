"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import BrokerBadge from "@/components/BrokerBadge";
import TopLogos from "@/components/TopLogos";
import QualificationForm from "@/components/QualificationForm";
import LoadingScreen from "@/components/LoadingScreen";
import PreRevealScreen from "@/components/PreRevealScreen";
import NoSellScreen from "@/components/NoSellScreen";
import LockScreen from "@/components/LockScreen";
import ResultsScreen from "@/components/results/ResultsScreen";
import type { AnalyzeResponse, Answers } from "@/lib/types";

// Verrou d'accès temporaire — le code est communiqué au client
// lors du paiement. Retirer ces 2 lignes + le rendu conditionnel
// ci-dessous pour désactiver le verrou.
const UNLOCK_STORAGE_KEY = "eval-vyncent-unlocked";
const UNLOCK_CODE = "69";

const HeroBackground = dynamic(() => import("@/components/HeroBackground"), { ssr: false });

type Stage = "hero" | "form" | "loading" | "preReveal" | "results" | "noSell";

const MIN_LOADING_MS = 2000;

export default function Home() {
  const [stage, setStage] = useState<Stage>("hero");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [analyze, setAnalyze] = useState<AnalyzeResponse | null>(null);
  const [revealChoice, setRevealChoice] = useState<"yes" | "no">("no");

  // Verrou d'accès — null = pas encore vérifié (rien à rendre pour éviter le flash)
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  useEffect(() => {
    setUnlocked(
      typeof window !== "undefined" &&
        window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "true"
    );
  }, []);
  const handleUnlock = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
    }
    setUnlocked(true);
  };

  const handleFormComplete = async (finalAnswers: Answers) => {
    setAnswers(finalAnswers);
    setStage("loading");
    if (typeof window !== "undefined") window.scrollTo(0, 0);

    const startedAt = performance.now();
    let result: AnalyzeResponse | null = null;
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (res.ok) {
        result = (await res.json()) as AnalyzeResponse;
      }
    } catch {
      // result reste null
    }

    const elapsed = performance.now() - startedAt;
    const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
    setTimeout(() => {
      if (result) {
        setAnalyze(result);
        // On passe par l'écran de pré-révélation avant les vrais résultats
        setStage("preReveal");
        if (typeof window !== "undefined") window.scrollTo(0, 0);
      } else {
        setStage("form");
      }
    }, remaining);
  };

  const revealResults = (choice: "yes" | "no") => {
    setRevealChoice(choice);
    setStage("results");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const handleNoSell = (partialAnswers: Answers) => {
    setAnswers(partialAnswers);
    setStage("noSell");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const restart = () => {
    setAnswers(null);
    setAnalyze(null);
    setRevealChoice("no");
    setStage("hero");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const showChrome =
    stage === "hero" || stage === "preReveal" || stage === "results" || stage === "noSell";

  // Verrou : rien tant qu'on ne sait pas, puis LockScreen si non débloqué.
  if (unlocked === null) return null;
  if (!unlocked) {
    return (
      <main className="min-h-screen">
        <LockScreen expectedCode={UNLOCK_CODE} onUnlock={handleUnlock} />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatePresence>
        {stage === "hero" && (
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 -z-10"
          >
            <HeroBackground />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === "hero" && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <Hero onStart={() => setStage("form")} />
          </motion.div>
        )}
        {stage === "form" && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <QualificationForm
              onComplete={handleFormComplete}
              onNoSell={handleNoSell}
              onExit={() => setStage("hero")}
            />
          </motion.div>
        )}
        {stage === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <LoadingScreen />
          </motion.div>
        )}
        {stage === "preReveal" && analyze && (
          <motion.div key="preReveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <PreRevealScreen onContinue={revealResults} />
          </motion.div>
        )}
        {stage === "results" && analyze && answers && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ResultsScreen
              analyze={analyze}
              answers={answers}
              revealChoice={revealChoice}
              onRestart={restart}
            />
          </motion.div>
        )}
        {stage === "noSell" && answers && (
          <motion.div key="noSell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <NoSellScreen answers={answers} onRestart={restart} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logos + badge courtier — visibles sur le hero, les résultats et la page no-sell */}
      <AnimatePresence>
        {showChrome && (
          <motion.div
            key="brand-chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TopLogos />
            <BrokerBadge />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
