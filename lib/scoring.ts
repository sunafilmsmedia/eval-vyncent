import type { Answers, ScoringFactor, ScoringResult, Verdict } from "./types";

const BASE_SCORE = 50;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function verdictFor(score: number): Verdict {
  if (score >= 65) return "favorable";
  if (score >= 45) return "moyen";
  return "defavorable";
}

export function computeScoring(answers: Answers): ScoringResult {
  const factors: ScoringFactor[] = [];
  let score = BASE_SCORE;

  const purchase = answers.purchasePrice ?? 0;
  const value = answers.estimatedValue ?? 0;
  const years = Math.max(0, answers.yearsOwned ?? 0);

  // Plus-value
  let appreciation = 0;
  if (purchase > 0 && value > 0) {
    appreciation = (value - purchase) / purchase;
    if (appreciation >= 0.5) {
      score += 20;
      factors.push({
        label: `Plus-value de ${(appreciation * 100).toFixed(0)} % — très favorable`,
        delta: 20,
        tone: "positive",
      });
    } else if (appreciation >= 0.2) {
      score += 12;
      factors.push({
        label: `Plus-value de ${(appreciation * 100).toFixed(0)} % — favorable`,
        delta: 12,
        tone: "positive",
      });
    } else if (appreciation >= 0) {
      score += 3;
      factors.push({
        label: `Plus-value modeste de ${(appreciation * 100).toFixed(0)} %`,
        delta: 3,
        tone: "neutral",
      });
    } else {
      score -= 15;
      factors.push({
        label: `Perte de valeur de ${(appreciation * 100).toFixed(0)} %`,
        delta: -15,
        tone: "negative",
      });
    }
  }

  // Rendement annualisé
  let annualizedReturn = 0;
  if (purchase > 0 && value > 0 && years > 0) {
    annualizedReturn = Math.pow(value / purchase, 1 / years) - 1;
    if (annualizedReturn >= 0.06) {
      score += 8;
      factors.push({
        label: `Rendement annualisé fort (${(annualizedReturn * 100).toFixed(1)} %/an)`,
        delta: 8,
        tone: "positive",
      });
    } else if (annualizedReturn >= 0.03) {
      score += 4;
      factors.push({
        label: `Rendement annualisé sain (${(annualizedReturn * 100).toFixed(1)} %/an)`,
        delta: 4,
        tone: "positive",
      });
    } else if (annualizedReturn < 0) {
      score -= 5;
      factors.push({
        label: `Rendement annualisé négatif (${(annualizedReturn * 100).toFixed(1)} %/an)`,
        delta: -5,
        tone: "negative",
      });
    }
  }

  // Équité accumulée
  if (years >= 6) {
    score += 6;
    factors.push({
      label: `Équité bien établie (${years} ans de possession)`,
      delta: 6,
      tone: "positive",
    });
  } else if (years < 3 && years > 0) {
    score -= 8;
    factors.push({
      label: `Possession récente (${years} ans) — équité limitée`,
      delta: -8,
      tone: "negative",
    });
  }

  // Statut hypothèque
  switch (answers.mortgageStatus) {
    case "payee":
      score += 10;
      factors.push({ label: "Hypothèque entièrement payée", delta: 10, tone: "positive" });
      break;
    case "moins_25":
      score += 6;
      factors.push({ label: "Hypothèque presque remboursée", delta: 6, tone: "positive" });
      break;
    case "25_50":
      score += 2;
      factors.push({ label: "Hypothèque à mi-parcours", delta: 2, tone: "neutral" });
      break;
    case "plus_50":
      score -= 4;
      factors.push({
        label: "Hypothèque encore importante",
        delta: -4,
        tone: "negative",
      });
      break;
    case "incertain":
      factors.push({
        label: "Statut hypothécaire à clarifier avec ton courtier",
        delta: 0,
        tone: "neutral",
      });
      break;
  }

  // Situation familiale
  if (answers.childrenStatus === "partis") {
    score += 8;
    factors.push({ label: "Nid vide — moment naturel pour vendre", delta: 8, tone: "positive" });
  } else if (answers.childrenStatus === "partent_3_ans") {
    score += 5;
    factors.push({
      label: "Enfants en transition d'autonomie",
      delta: 5,
      tone: "positive",
    });
  } else if (answers.childrenStatus === "manque_espace") {
    score += 6;
    factors.push({
      label: "Besoin d'espace supplémentaire identifié",
      delta: 6,
      tone: "positive",
    });
  } else if (answers.childrenStatus === "encore_maison") {
    score -= 2;
    factors.push({
      label: "Enfants encore à la maison — stabilité prioritaire",
      delta: -2,
      tone: "neutral",
    });
  }

  if (answers.noChildrenPlan === "oui_bientot") {
    score += 4;
    factors.push({
      label: "Projet d'agrandir bientôt — agir pendant le marché actuel",
      delta: 4,
      tone: "positive",
    });
  } else if (answers.noChildrenPlan === "peut_etre") {
    score += 1;
    factors.push({ label: "Plans familiaux en réflexion", delta: 1, tone: "neutral" });
  }

  // Profil financier
  switch (answers.financialProfile) {
    case "salarie":
    case "retraite":
      score += 8;
      factors.push({
        label: "Profil financier stable aux yeux des prêteurs",
        delta: 8,
        tone: "positive",
      });
      break;
    case "placements":
      score += 6;
      factors.push({
        label: "Revenus de placements — bonne flexibilité",
        delta: 6,
        tone: "positive",
      });
      break;
    case "autonome":
    case "entrepreneur":
      score += 3;
      factors.push({
        label: "Revenus indépendants — prévoir 2 ans d'historique pour les prêteurs",
        delta: 3,
        tone: "neutral",
      });
      break;
    case "transition":
      score -= 10;
      factors.push({
        label: "Période de transition — prudence avant de s'engager",
        delta: -10,
        tone: "negative",
      });
      break;
  }

  const finalScore = Math.round(clamp(score, 0, 100));
  return {
    score: finalScore,
    verdict: verdictFor(finalScore),
    factors,
    metrics: {
      appreciation,
      annualizedReturn,
      yearsOwned: years,
    },
  };
}
