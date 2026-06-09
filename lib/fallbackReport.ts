import type { Answers, Report, ScoringResult } from "./types";

function pct(n: number, digits = 0) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(digits)} %`;
}

export function buildFallbackReport(answers: Answers, scoring: ScoringResult): Report {
  const { score, verdict, metrics } = scoring;
  const value = answers.estimatedValue ?? 0;
  const purchase = answers.purchasePrice ?? 0;
  const gain = value - purchase;

  const headlineByVerdict: Record<typeof verdict, string> = {
    favorable:
      "Les indicateurs sont alignés — c'est un moment naturel pour envisager la vente.",
    moyen:
      "Le moment est correct, mais certains éléments méritent une discussion avant d'agir.",
    defavorable:
      "Le timing actuel n'est pas optimal — mieux vaut consolider ta position avant de vendre.",
  };

  const summaryByVerdict: Record<typeof verdict, string> = {
    favorable: `Tu as accumulé environ ${pct(metrics.appreciation)} de plus-value sur ${metrics.yearsOwned || "quelques"} ans. Avec ta situation actuelle, vendre maintenant te placerait dans une position de force pour ton prochain projet.`,
    moyen: `Tu as ${pct(metrics.appreciation)} de plus-value, mais quelques éléments (financement, équité ou contexte familial) freinent un peu le potentiel. Une conversation avec un courtier permettrait d'évaluer si quelques mois changeraient le portrait.`,
    defavorable: `Ta plus-value (${pct(metrics.appreciation)}) ou ton équité actuelle ne justifient pas une vente précipitée. Tes coordonnées seront supprimées comme promis — on te recommande de réévaluer dans 12 à 24 mois.`,
  };

  const marketInsightByVerdict: Record<typeof verdict, string> = {
    favorable:
      "Le marché de l'Outaouais reste soutenu par la demande des acheteurs venant d'Ottawa. Les propriétés bien préparées se vendent généralement en moins de 45 jours.",
    moyen:
      "Le marché de l'Outaouais est en transition : les acheteurs prennent plus de temps, mais les bonnes propriétés trouvent toujours preneur au juste prix.",
    defavorable:
      "Le marché actuel favorise davantage les acheteurs sur certains segments. Patienter peut permettre de capitaliser sur une remontée des évaluations.",
  };

  const stats = [
    {
      label: "Score d'opportunité",
      value: `${score}/100`,
      detail:
        verdict === "favorable"
          ? "Conditions globalement réunies."
          : verdict === "moyen"
          ? "À optimiser avant de mettre en marché."
          : "Mieux vaut attendre.",
    },
    {
      label: "Plus-value estimée",
      value: pct(metrics.appreciation),
      detail:
        gain > 0
          ? `Soit environ ${gain.toLocaleString("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })} de gain brut.`
          : "Position de retrait actuellement.",
    },
    {
      label: "Années de possession",
      value: `${metrics.yearsOwned} an${metrics.yearsOwned > 1 ? "s" : ""}`,
      detail:
        metrics.yearsOwned >= 6
          ? "Équité bien établie."
          : "Équité en construction.",
    },
    {
      label: "Rendement annualisé",
      value: `${(metrics.annualizedReturn * 100).toFixed(1)} %/an`,
      detail:
        metrics.annualizedReturn >= 0.04
          ? "Au-dessus de la moyenne du marché."
          : "Sous la moyenne historique du marché.",
    },
  ];

  const stepsFavorable = [
    {
      title: "Préparer ton dossier financier",
      description:
        "Réunir tes documents hypothécaires et fiscaux pour évaluer rapidement ton net après vente.",
    },
    {
      title: "Évaluation comparative (CMA)",
      description:
        "Vyncent te transmettra une analyse comparative des dernières ventes dans ton secteur.",
    },
    {
      title: "Plan de mise en marché",
      description:
        "Photos professionnelles, home staging léger, stratégie multi-plateforme adaptée à ton type de propriété.",
    },
    {
      title: "Stratégie de relogement",
      description:
        "On planifie la transition avant la vente pour éviter toute pression à signer une offre.",
    },
  ];

  const stepsMoyen = [
    {
      title: "Clarifier ton objectif financier",
      description:
        "Définir le net souhaité après vente pour valider si le marché actuel le permet.",
    },
    {
      title: "Optimiser la propriété",
      description:
        "Identifier 2-3 améliorations à fort levier (peinture, luminosité, espaces extérieurs).",
    },
    {
      title: "Tester la valeur",
      description:
        "Une analyse comparative récente te donnera une fourchette réaliste avant d'engager des frais.",
    },
    {
      title: "Décider ensemble du timing",
      description:
        "Si les chiffres ne sont pas au rendez-vous, attendre 6 à 12 mois peut faire une différence notable.",
    },
  ];

  const stepsDefavorable = [
    {
      title: "Garder ton équité au travail",
      description:
        "Continuer à rembourser ton hypothèque renforce ta position pour la prochaine fenêtre.",
    },
    {
      title: "Suivre le marché de loin",
      description:
        "On peut t'envoyer une mise à jour annuelle sans aucun engagement, simplement à titre informatif.",
    },
    {
      title: "Améliorer la valeur perçue",
      description:
        "Petits travaux ciblés qui augmentent la valeur sans surinvestissement.",
    },
    {
      title: "Réévaluer dans 12 à 24 mois",
      description:
        "Tes coordonnées seront supprimées comme promis. Reviens nous voir quand tu seras prêt.",
    },
  ];

  const steps =
    verdict === "favorable" ? stepsFavorable : verdict === "moyen" ? stepsMoyen : stepsDefavorable;

  return {
    headline: headlineByVerdict[verdict],
    summary: summaryByVerdict[verdict],
    stats,
    steps,
    marketInsight: marketInsightByVerdict[verdict],
  };
}
