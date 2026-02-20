export type NenkinMode = "kosei" | "kokumin";

export interface NenkinInputs {
  mode: NenkinMode;
  averageMonthlyGrossSalary: number | null;
  contributionMonths: number | null;
}

export interface NenkinValidation {
  isEligible: boolean;
  message: string | null;
}

export interface NenkinAmounts {
  gross: number;
  tax: number;
  net: number;
}

export type NenkinScenario = "optimistic" | "conservative";

export interface TimelineStep {
  label: string;
  sublabel: string;
}

export interface KoseiTimeline {
  scenario: NenkinScenario;
  stage1Months: number;
  stage2AdditionalMonths: number;
  steps: [TimelineStep, TimelineStep, TimelineStep];
}

export interface KokuminTimeline {
  minMonths: number;
  maxMonths: number;
  steps: [TimelineStep, TimelineStep];
}

export interface KoseiNenkinResult {
  mode: "kosei";
  ratio: number;
  taxRate: number;
  amounts: NenkinAmounts;
  stage1Gross: number;
  stage2Gross: number;
  timelines: Record<NenkinScenario, KoseiTimeline>;
}

export interface KokuminNenkinResult {
  mode: "kokumin";
  taxRate: number;
  amounts: NenkinAmounts;
  timeline: KokuminTimeline;
}

export type NenkinResult = KoseiNenkinResult | KokuminNenkinResult;

