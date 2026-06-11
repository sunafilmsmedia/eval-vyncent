"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import Hero from "@/components/Hero";
import BrokerBadge from "@/components/BrokerBadge";
import TopLogos from "@/components/TopLogos";
import QualificationForm from "@/components/QualificationForm";
import ResultsScreen from "@/components/results/ResultsScreen";
import type { AnalyzeResponse } from "@/lib/types";

const HeroBackground = dynamic(() => import("@/components/HeroBackground"), { ssr: false });

type Stage = "hero" | "form" | "results";

interface CompletionPayload {
  analyze: AnalyzeResponse;
  leadStored: boolean;
  leadName: string;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("hero");
  const [result, setResult] = useState<CompletionPayload | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Carte de fond — visible uniquement sur le hero */}
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
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onStart={() => setStage("form")} />
          </motion.div>
        )}
        {stage === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <QualificationForm
              onComplete={(payload) => {
                setResult(payload);
                setStage("results");
                if (typeof window !== "undefined") window.scrollTo(0, 0);
              }}
              onExit={() => setStage("hero")}
            />
          </motion.div>
        )}
        {stage === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResultsScreen
              analyze={result.analyze}
              leadStored={result.leadStored}
              leadName={result.leadName}
              onRestart={() => {
                setResult(null);
                setStage("hero");
                if (typeof window !== "undefined") window.scrollTo(0, 0);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logos en haut + badge courtier — visibles sur le hero et les résultats */}
      <AnimatePresence>
        {(stage === "hero" || stage === "results") && (
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
