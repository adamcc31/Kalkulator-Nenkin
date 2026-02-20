"use client";

import type { NenkinMode, NenkinScenario, TimelineStep } from "@/types/nenkin";

function getPositions(count: number): number[] {
  if (count === 2) return [0, 100];
  if (count === 3) return [0, 45, 100];
  if (count <= 1) return [0];
  return Array.from({ length: count }, (_, idx) => (idx / (count - 1)) * 100);
}

export function TimelineEstimator({
  mode,
  steps,
  scenario,
  onChangeScenario,
}: {
  mode: NenkinMode;
  steps: TimelineStep[];
  scenario: NenkinScenario;
  onChangeScenario: (scenario: NenkinScenario) => void;
}) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs uppercase tracking-widest text-text-sub-light dark:text-text-sub-dark font-bold">
          Estimasi Waktu Pencairan
        </h3>
        {mode === "kosei" ? (
          <div className="flex bg-gray-100 dark:bg-background-dark p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onChangeScenario("optimistic")}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${
                scenario === "optimistic"
                  ? "bg-white dark:bg-surface-dark shadow-sm text-primary"
                  : "text-text-sub-light dark:text-gray-500 hover:text-text-main-light dark:hover:text-gray-300 transition-colors"
              }`}
            >
              Optimis
            </button>
            <button
              type="button"
              onClick={() => onChangeScenario("conservative")}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${
                scenario === "conservative"
                  ? "bg-white dark:bg-surface-dark shadow-sm text-primary"
                  : "text-text-sub-light dark:text-gray-500 hover:text-text-main-light dark:hover:text-gray-300 transition-colors"
              }`}
            >
              Konservatif
            </button>
          </div>
        ) : null}
      </div>

      <div className="relative h-24 w-full flex items-center px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full" />
        {steps.map((step, idx) => {
          const isStart = idx === 0;
          const isEnd = idx === steps.length - 1;
          const isMiddle = !isStart && !isEnd;
          const positions = getPositions(steps.length);
          const left = positions[idx];

          const dotClass = isStart
            ? "bg-primary ring-4 ring-white dark:ring-background-dark shadow-sm z-10"
            : isEnd
              ? "bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-background-dark z-10"
              : "bg-white dark:bg-surface-dark border-2 border-primary ring-4 ring-white dark:ring-background-dark z-10 shadow-sm";

          const containerClass = isStart
            ? "absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-start group"
            : isEnd
              ? "absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end group"
              : "absolute top-1/2 -translate-y-1/2 flex flex-col items-center group";

          const labelBlockClass = isStart
            ? "absolute top-8 flex flex-col items-start w-24"
            : isEnd
              ? "absolute top-8 flex flex-col items-end w-32 text-right"
              : "absolute top-8 flex flex-col items-center w-32 text-center";

          return (
            <div
              key={`${step.label}-${idx}`}
              className={containerClass}
              style={isMiddle ? { left: `${left}%` } : undefined}
            >
              <div className={`w-4 h-4 rounded-full ${dotClass}`} />
              <div className={labelBlockClass}>
                <span className="text-[10px] font-bold text-text-main-light dark:text-white uppercase tracking-wider">
                  {step.label}
                </span>
                <span className="text-[10px] text-text-sub-light dark:text-gray-500">
                  {step.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
