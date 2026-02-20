"use client";

import { useMemo, useState } from "react";
import type {
  KokuminNenkinResult,
  KoseiNenkinResult,
  NenkinMode,
  NenkinResult,
  NenkinValidation,
} from "@/types/nenkin";

const TAX_RATE = 0.2042;

const KOSEI_RATIO_TABLE: ReadonlyArray<{
  min: number;
  max: number;
  ratio: number;
}> = [
  { min: 6, max: 11, ratio: 0.5 },
  { min: 12, max: 17, ratio: 1.1 },
  { min: 18, max: 23, ratio: 1.6 },
  { min: 24, max: 29, ratio: 2.2 },
  { min: 30, max: 35, ratio: 2.7 },
  { min: 36, max: 41, ratio: 3.3 },
  { min: 42, max: 47, ratio: 3.8 },
  { min: 48, max: 53, ratio: 4.4 },
  { min: 54, max: 59, ratio: 4.9 },
  { min: 60, max: 119, ratio: 5.5 },
] as const;

const KOKUMIN_TABLE: Readonly<Record<number, number>> = {
  6: 52_530,
  12: 105_060,
  18: 157_590,
  24: 210_120,
  30: 262_650,
  36: 315_180,
  42: 367_710,
  48: 420_240,
  54: 472_770,
  60: 525_300,
};

function sanitizePositiveInteger(value: number | null): number | null {
  if (value === null) return null;
  if (!Number.isFinite(value)) return null;
  const floored = Math.floor(value);
  if (floored < 0) return null;
  return floored;
}

function sanitizePositiveNumber(value: number | null): number | null {
  if (value === null) return null;
  if (!Number.isFinite(value)) return null;
  if (value < 0) return null;
  return value;
}

function getKoseiRatio(months: number): number {
  const entry = KOSEI_RATIO_TABLE.find((row) => months >= row.min && months <= row.max);
  return entry?.ratio ?? 0;
}

function getKokuminAmount(months: number): number {
  const keys = Object.keys(KOKUMIN_TABLE)
    .map((k) => Number(k))
    .filter((k) => Number.isFinite(k))
    .sort((a, b) => a - b);
  const start = [...keys].reverse().find((k) => months >= k);
  const amount = start ? KOKUMIN_TABLE[start] : 0;
  return amount ?? 0;
}

export function formatJPY(value: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export interface UseNenkinCalculatorState {
  mode: NenkinMode;
  setMode: (mode: NenkinMode) => void;
  averageMonthlyGrossSalary: number | null;
  setAverageMonthlyGrossSalary: (value: number | null) => void;
  contributionMonths: number | null;
  setContributionMonths: (value: number | null) => void;
  sanitizedMonths: number | null;
  validation: NenkinValidation;
  result: NenkinResult | null;
}

export function useNenkinCalculator(): UseNenkinCalculatorState {
  const [mode, setMode] = useState<NenkinMode>("kosei");
  const [averageMonthlyGrossSalary, setAverageMonthlyGrossSalary] = useState<number | null>(300_000);
  const [contributionMonths, setContributionMonths] = useState<number | null>(36);

  const sanitizedMonths = useMemo(
    () => sanitizePositiveInteger(contributionMonths),
    [contributionMonths],
  );

  const validation: NenkinValidation = useMemo(() => {
    if (sanitizedMonths === null) {
      return { isEligible: false, message: null };
    }
    if (sanitizedMonths < 6) {
      return { isEligible: false, message: "Not Eligible" };
    }
    if (sanitizedMonths >= 120) {
      return { isEligible: false, message: "Not Eligible for Lump Sum" };
    }
    return { isEligible: true, message: null };
  }, [sanitizedMonths]);

  const result: NenkinResult | null = useMemo(() => {
    if (!validation.isEligible || sanitizedMonths === null) return null;

    if (mode === "kokumin") {
      const gross = getKokuminAmount(sanitizedMonths);
      const tax = 0;
      const net = Math.round(gross);

      const kokumin: KokuminNenkinResult = {
        mode: "kokumin",
        taxRate: 0,
        amounts: {
          gross: Math.round(gross),
          tax,
          net,
        },
        timeline: {
          minMonths: 4,
          maxMonths: 6,
          steps: [
            { label: "Kirim Bekas", sublabel: "Mulai" },
            { label: "Cair (100%)", sublabel: "~4–6 Bulan" },
          ],
        },
      };

      return kokumin;
    }

    const salary = sanitizePositiveNumber(averageMonthlyGrossSalary);
    if (salary === null || salary === 0) return null;

    const ratio = getKoseiRatio(sanitizedMonths);
    const gross = Math.round(salary * ratio);
    const net = Math.ceil(gross * (1 - TAX_RATE));
    const tax = Math.round(gross - net);
    const stage1Gross = net;
    const stage2Gross = tax;

    const kosei: KoseiNenkinResult = {
      mode: "kosei",
      ratio,
      taxRate: TAX_RATE,
      amounts: { gross, tax, net },
      stage1Gross,
      stage2Gross,
      timelines: {
        optimistic: {
          scenario: "optimistic",
          stage1Months: 3,
          stage2AdditionalMonths: 2,
          steps: [
            { label: "Kirim Bekas", sublabel: "Mulai" },
            { label: "Proses Nenkin (80%)", sublabel: "~4 Bulan" },
            { label: "Refund Pajak (20%)", sublabel: "+2 Bulan" },
          ],
        },
        conservative: {
          scenario: "conservative",
          stage1Months: 6,
          stage2AdditionalMonths: 3,
          steps: [
            { label: "Kirim Bekas", sublabel: "Mulai" },
            { label: "Proses Nenkin (80%)", sublabel: "~6 Bulan" },
            { label: "Refund Pajak (20%)", sublabel: "+3 Bulan" },
          ],
        },
      },
    };

    return kosei;
  }, [averageMonthlyGrossSalary, mode, sanitizedMonths, validation.isEligible]);

  return {
    mode,
    setMode,
    averageMonthlyGrossSalary,
    setAverageMonthlyGrossSalary,
    contributionMonths,
    setContributionMonths,
    sanitizedMonths,
    validation,
    result,
  };
}
