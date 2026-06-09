export type PropertyType = "maison" | "condo" | "plex" | "chalet";

export type MortgageStatus = "payee" | "moins_25" | "25_50" | "plus_50" | "incertain";

export type ChildrenStatus = "partis" | "partent_3_ans" | "encore_maison" | "manque_espace";

export type NoChildrenPlan = "oui_bientot" | "peut_etre" | "non";

export type FinancialProfile =
  | "salarie"
  | "autonome"
  | "entrepreneur"
  | "placements"
  | "retraite"
  | "transition";

export type Region = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export interface Answers {
  propertyType?: PropertyType;
  yearsOwned?: number;
  purchasePrice?: number;
  estimatedValue?: number;
  mortgageStatus?: MortgageStatus;
  hasChildren?: boolean;
  childrenStatus?: ChildrenStatus;
  noChildrenPlan?: NoChildrenPlan;
  financialProfile?: FinancialProfile;
  region?: string;
}

export type Verdict = "favorable" | "moyen" | "defavorable";

export interface ScoringResult {
  score: number;
  verdict: Verdict;
  factors: ScoringFactor[];
  metrics: {
    appreciation: number;
    annualizedReturn: number;
    yearsOwned: number;
  };
}

export interface ScoringFactor {
  label: string;
  delta: number;
  tone: "positive" | "negative" | "neutral";
}

export interface ReportStat {
  label: string;
  value: string;
  detail: string;
}

export interface ReportStep {
  title: string;
  description: string;
}

export interface Report {
  headline: string;
  summary: string;
  stats: ReportStat[];
  steps: ReportStep[];
  marketInsight: string;
}

export interface AnalyzeResponse {
  scoring: ScoringResult;
  report: Report;
  generatedBy: "claude" | "fallback";
}

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  consent: boolean;
  answers: Answers;
}
