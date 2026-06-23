import type { Answers, ScoringFactor, ScoringResult, Verdict } from "./types";

const BASE_SCORE = 50;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Nouveaux seuils :
//  > 65   → favorable      "C'est le moment idéal !"
//  50-65  → moyen          "Tu es prêt à vendre !"
//  < 50   → defavorable    "Tu n'es pas prêt encore..."
function verdictFor(score: number): Verdict {
  if (score > 65) return "favorable";
  if (score >= 50) return "moyen";
  return "defavorable";
}

export function computeScoring(answers: Answers): ScoringResult {
  const factors: ScoringFactor[] = [];
  let score = BASE_SCORE;

  const years = Math.max(0, answers.yearsOwned ?? 0);
  const value = Math.max(0, answers.estimatedValue ?? 0);

  // Années de possession (proxy d'équité accumulée)
  if (years >= 10) {
    score += 15;
    factors.push({
      label: `Équité bien établie (${years} ans de possession)`,
      delta: 15,
      tone: "positive",
    });
  } else if (years >= 6) {
    score += 10;
    factors.push({
      label: `Équité solide (${years} ans de possession)`,
      delta: 10,
      tone: "positive",
    });
  } else if (years >= 3) {
    score += 2;
    factors.push({
      label: `Équité en construction (${years} ans)`,
      delta: 2,
      tone: "neutral",
    });
  } else if (years > 0) {
    score -= 10;
    factors.push({
      label: `Possession récente (${years} ans) — équité limitée`,
      delta: -10,
      tone: "negative",
    });
  }

  // Motivation de vente (signal le plus fort de la nouvelle version)
  switch (answers.sellingMotivation) {
    case "relocation":
      score += 14;
      factors.push({
        label: "Déménagement planifié — intention claire",
        delta: 14,
        tone: "positive",
      });
      break;
    case "upsize":
      score += 12;
      factors.push({
        label: "Besoin d'espace identifié — moment naturel pour bouger",
        delta: 12,
        tone: "positive",
      });
      break;
    case "downsize":
      score += 11;
      factors.push({
        label: "Volonté de simplifier — moment naturel pour vendre",
        delta: 11,
        tone: "positive",
      });
      break;
    // "no_sell" est court-circuité avant le scoring — n'arrive pas ici
  }

  // Situation familiale
  if (answers.childrenStatus === "partis") {
    score += 10;
    factors.push({
      label: "Nid vide — moment naturel pour vendre",
      delta: 10,
      tone: "positive",
    });
  } else if (answers.childrenStatus === "partent_3_ans") {
    score += 6;
    factors.push({
      label: "Enfants en transition d'autonomie",
      delta: 6,
      tone: "positive",
    });
  } else if (answers.childrenStatus === "manque_espace") {
    score += 8;
    factors.push({
      label: "Besoin d'espace supplémentaire identifié",
      delta: 8,
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
    score += 5;
    factors.push({
      label: "Projet d'agrandir bientôt",
      delta: 5,
      tone: "positive",
    });
  } else if (answers.noChildrenPlan === "peut_etre") {
    score += 1;
    factors.push({
      label: "Plans familiaux en réflexion",
      delta: 1,
      tone: "neutral",
    });
  }

  // Profil financier
  switch (answers.financialProfile) {
    case "salarie":
    case "retraite":
      score += 10;
      factors.push({
        label: "Profil financier stable aux yeux des prêteurs",
        delta: 10,
        tone: "positive",
      });
      break;
    case "placements":
      score += 8;
      factors.push({
        label: "Revenus de placements — bonne flexibilité",
        delta: 8,
        tone: "positive",
      });
      break;
    case "autonome":
    case "entrepreneur":
      score += 4;
      factors.push({
        label: "Revenus indépendants — prévoir 2 ans d'historique pour les prêteurs",
        delta: 4,
        tone: "neutral",
      });
      break;
    case "transition":
      score -= 12;
      factors.push({
        label: "Période de transition — prudence avant de s'engager",
        delta: -12,
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
      yearsOwned: years,
      estimatedValue: value,
    },
  };
}
