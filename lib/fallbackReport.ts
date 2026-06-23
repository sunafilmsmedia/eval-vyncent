import type { Answers, Report, ScoringResult } from "./types";
import { formatCurrency } from "./format";

const VERDICT_HEADLINE = {
  favorable: "C'est le moment idéal !",
  moyen: "Tu es prêt à vendre !",
  defavorable: "Tu n'es pas prêt encore.",
} as const;

const PROPERTY_LABEL: Record<string, string> = {
  maison: "Maison unifamiliale",
  condo: "Condo",
  plex: "Plex",
  chalet: "Chalet",
};

const MOTIVATION_LABEL: Record<string, string> = {
  upsize: "Passer à plus grand",
  downsize: "Réduire / simplifier",
  relocation: "Déménager ailleurs",
  no_sell: "Pas de vente prévue",
};

export function buildFallbackReport(answers: Answers, scoring: ScoringResult): Report {
  const { score, verdict, metrics } = scoring;

  const summaryByVerdict = {
    favorable: `Avec ${metrics.yearsOwned} année${metrics.yearsOwned > 1 ? "s" : ""} de possession et ta situation actuelle, tous les signaux pointent vers une vente avantageuse. C'est rare d'avoir un alignement aussi complet — autant en profiter pendant que la fenêtre est ouverte.`,
    moyen: `Tu as accumulé une bonne équité et ta situation s'y prête bien. Quelques optimisations préalables pourraient maximiser ton retour, mais tu peux clairement avancer vers une mise en marché.`,
    defavorable: `Quelques éléments freinent encore l'opportunité — équité, situation familiale ou financière. Mieux vaut consolider ta position avant de mettre en marché. Reviens nous voir dans 12 à 24 mois.`,
  };

  const marketInsightByVerdict = {
    favorable:
      "Le marché de l'Outaouais reste soutenu par la demande des acheteurs venant d'Ottawa. Les propriétés bien préparées se vendent généralement en moins de 45 jours.",
    moyen:
      "Le marché de l'Outaouais est en transition : les acheteurs prennent un peu plus de temps, mais les bonnes propriétés trouvent toujours preneur au juste prix.",
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
      label: "Années de possession",
      value: `${metrics.yearsOwned} an${metrics.yearsOwned > 1 ? "s" : ""}`,
      detail:
        metrics.yearsOwned >= 6
          ? "Équité bien établie."
          : metrics.yearsOwned >= 3
          ? "Équité en construction."
          : "Équité encore jeune.",
    },
    {
      label: "Valeur estimée",
      value: metrics.estimatedValue ? formatCurrency(metrics.estimatedValue) : "—",
      detail: "Selon ton estimation actuelle du marché.",
    },
    {
      label: "Motivation",
      value: answers.sellingMotivation ? MOTIVATION_LABEL[answers.sellingMotivation] : "—",
      detail: `Type : ${answers.propertyType ? PROPERTY_LABEL[answers.propertyType] : "—"}`,
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
    headline: VERDICT_HEADLINE[verdict],
    summary: summaryByVerdict[verdict],
    stats,
    steps,
    marketInsight: marketInsightByVerdict[verdict],
  };
}
