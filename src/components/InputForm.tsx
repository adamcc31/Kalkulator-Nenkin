"use client";

import type { NenkinMode } from "@/types/nenkin";

export function InputForm({
  mode,
  averageMonthlyGrossSalary,
  onChangeAverageMonthlyGrossSalary,
  contributionMonths,
  onChangeContributionMonths,
}: {
  mode: NenkinMode;
  averageMonthlyGrossSalary: number | null;
  onChangeAverageMonthlyGrossSalary: (value: number | null) => void;
  contributionMonths: number | null;
  onChangeContributionMonths: (value: number | null) => void;
}) {
  return (
    <div className="space-y-6">
      {mode === "kosei" ? (
        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-text-main-light dark:text-gray-200 group-focus-within:text-primary transition-colors">
            Rata-rata Gaji Kotor Bulanan (Yen)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-display text-lg">
              ¥
            </span>
            <input
              className="w-full bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg p-4 pl-10 text-xl font-display font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 text-text-main-light dark:text-white"
              placeholder="300,000"
              type="number"
              min={0}
              step="0.01"
              value={averageMonthlyGrossSalary ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                onChangeAverageMonthlyGrossSalary(raw === "" ? null : Number(raw));
              }}
            />
          </div>
          <p className="text-xs text-text-sub-light dark:text-gray-500 mt-2">
            Gaji kotor bulanan adalah gaji yang belum di potong pajak dan asuransi.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-border-light dark:border-gray-700 bg-gray-50 dark:bg-background-dark text-xs text-text-sub-light dark:text-gray-500">
          Kokumin Nenkin tidak menggunakan parameter gaji.
        </div>
      )}

      <div className="group">
        <label className="block text-sm font-semibold mb-2 text-text-main-light dark:text-gray-200 group-focus-within:text-primary transition-colors">
          Masa Iuran (Bulan)
        </label>
        <div className="relative">
          <input
            className="w-full bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-xl font-display font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 text-text-main-light dark:text-white"
            placeholder="36"
            type="number"
            min={0}
            step="1"
            inputMode="numeric"
            value={contributionMonths ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              onChangeContributionMonths(raw === "" ? null : Number(raw));
            }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-gray-200 dark:bg-surface-dark border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-text-sub-light dark:text-gray-400">
            BULAN
          </span>
        </div>
        <div className="flex justify-between items-start mt-2">
          <p className="text-xs text-text-sub-light dark:text-gray-500">
            Rentang valid: 6 - 119 bulan
          </p>
          <p className="text-xs text-primary text-right max-w-[180px] flex items-center justify-end gap-1">
            <span className="material-icons-outlined text-[14px]">info</span>
            Maksimal pengali 60 bulan (5.5) untuk Kōsei
          </p>
        </div>
      </div>
    </div>
  );
}
