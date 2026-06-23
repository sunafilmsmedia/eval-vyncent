import type { Answers } from "./types";

export type QuestionId =
  | "propertyType"
  | "sellingMotivation"
  | "yearsOwned"
  | "estimatedValue"
  | "hasChildren"
  | "childrenStatus"
  | "noChildrenPlan"
  | "financialProfile"
  | "region";

export type QuestionKind =
  | "choice"
  | "number"
  | "currency"
  | "boolean"
  | "region";

export interface Choice<V extends string = string> {
  value: V;
  label: string;
  hint?: string;
}

export interface QuestionDef {
  id: QuestionId;
  kind: QuestionKind;
  title: string;
  subtitle?: string;
  choices?: Choice[];
  autoAdvance?: boolean;
  showIf?: (a: Answers) => boolean;
}

export const QUESTIONS: QuestionDef[] = [
  {
    id: "propertyType",
    kind: "choice",
    title: "Quel type de propriété possèdes-tu ?",
    subtitle: "On commence par le plus simple.",
    autoAdvance: true,
    choices: [
      { value: "maison", label: "Maison unifamiliale", hint: "Détachée ou jumelée" },
      { value: "condo", label: "Condo", hint: "Copropriété" },
      { value: "plex", label: "Plex", hint: "Duplex, triplex, multilogement" },
      { value: "chalet", label: "Chalet", hint: "Résidence secondaire" },
    ],
  },
  {
    id: "sellingMotivation",
    kind: "choice",
    title: "Pourquoi penses-tu vendre ?",
    subtitle: "C'est ce qui motive ta réflexion.",
    autoAdvance: true,
    choices: [
      { value: "upsize", label: "Pour passer à plus grand", hint: "Besoin de plus d'espace" },
      { value: "downsize", label: "Pour réduire ou simplifier", hint: "Moins d'entretien, moins grand" },
      { value: "relocation", label: "Pour déménager ailleurs", hint: "Autre secteur ou autre région" },
      { value: "no_sell", label: "Je ne veux pas vendre", hint: "Je suis simplement curieux" },
    ],
  },
  {
    id: "yearsOwned",
    kind: "number",
    title: "Depuis combien d'années es-tu propriétaire ?",
    subtitle: "Une estimation suffit.",
  },
  {
    id: "estimatedValue",
    kind: "currency",
    title: "Combien penses-tu qu'elle vaut aujourd'hui ?",
    subtitle: "Ton estimation à toi — pas besoin d'être exact.",
  },
  {
    id: "hasChildren",
    kind: "boolean",
    title: "Tu as des enfants ?",
    subtitle: "La dynamique familiale est un facteur clé.",
    autoAdvance: true,
  },
  {
    id: "childrenStatus",
    kind: "choice",
    title: "Où en sont-ils ?",
    subtitle: "Choisis ce qui te ressemble le plus.",
    autoAdvance: true,
    showIf: (a) => a.hasChildren === true,
    choices: [
      { value: "partis", label: "Déjà partis du nid" },
      { value: "partent_3_ans", label: "Ils partent d'ici 3 ans" },
      { value: "encore_maison", label: "Encore à la maison" },
      { value: "manque_espace", label: "On manque d'espace" },
    ],
  },
  {
    id: "noChildrenPlan",
    kind: "choice",
    title: "Penses-tu en avoir bientôt et agrandir ?",
    subtitle: "Pour mieux anticiper tes besoins d'espace.",
    autoAdvance: true,
    showIf: (a) => a.hasChildren === false,
    choices: [
      { value: "oui_bientot", label: "Oui, bientôt" },
      { value: "peut_etre", label: "Peut-être" },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "financialProfile",
    kind: "choice",
    title: "Quelle est ta situation financière ?",
    subtitle: "Pour évaluer ta flexibilité face aux prêteurs.",
    autoAdvance: true,
    choices: [
      { value: "salarie", label: "Emploi stable (salarié)" },
      { value: "autonome", label: "Travailleur autonome" },
      { value: "entrepreneur", label: "Entrepreneur" },
      { value: "placements", label: "Revenus de placements" },
      { value: "retraite", label: "Retraité" },
      { value: "transition", label: "En transition" },
    ],
  },
  {
    id: "region",
    kind: "region",
    title: "Dans quel secteur se trouve ta propriété ?",
    subtitle: "Touche un marqueur sur la carte.",
  },
];

export function getVisibleQuestions(answers: Answers): QuestionDef[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function isAnswered(q: QuestionDef, a: Answers): boolean {
  switch (q.id) {
    case "propertyType": return !!a.propertyType;
    case "sellingMotivation": return !!a.sellingMotivation;
    case "yearsOwned": return typeof a.yearsOwned === "number" && a.yearsOwned >= 0;
    case "estimatedValue": return typeof a.estimatedValue === "number" && a.estimatedValue > 0;
    case "hasChildren": return typeof a.hasChildren === "boolean";
    case "childrenStatus": return !!a.childrenStatus;
    case "noChildrenPlan": return !!a.noChildrenPlan;
    case "financialProfile": return !!a.financialProfile;
    case "region": return !!a.region;
  }
}
