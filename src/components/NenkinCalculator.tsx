"use client";

import { useNenkinCalculator } from "@/hooks/useNenkinCalculator";
import type { NenkinScenario, TimelineStep } from "@/types/nenkin";
import { useMemo, useState } from "react";
import { CalculatorCard } from "./CalculatorCard";
import { InputForm } from "./InputForm";
import { ResultDisplay } from "./ResultDisplay";
import { ThemeToggle } from "./ThemeToggle";
import { TimelineEstimator } from "./TimelineEstimator";
import Image from "next/image";


export function NenkinCalculator() {
  const {
    mode,
    setMode,
    averageMonthlyGrossSalary,
    setAverageMonthlyGrossSalary,
    contributionMonths,
    setContributionMonths,
    validation,
    result,
  } = useNenkinCalculator();

  const [scenario, setScenario] = useState<NenkinScenario>("optimistic");

  const steps: TimelineStep[] = useMemo(() => {
    if (mode === "kokumin") {
      return result?.mode === "kokumin"
        ? result.timeline.steps
        : [
          { label: "Kirim Berkas", sublabel: "Mulai" },
          { label: "Cair (100%)", sublabel: "~4–6 Bulan" },
        ];
    }

    if (result?.mode === "kosei") {
      return result.timelines[scenario].steps;
    }

    return [
      { label: "Kirim Berkas", sublabel: "Mulai" },
      { label: "Nenkin (80%)", sublabel: "~4 Bulan" },
      { label: "Refund Pajak (20%)", sublabel: "+2 Bulan" },
    ];
  }, [mode, result, scenario]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-300 min-h-screen flex flex-col font-sans relative">
      <div className="absolute inset-0 z-0 light-mode-pattern dark:pattern-bg pointer-events-none opacity-40 bg-repeat" />

      <nav className="relative z-50 w-full border-b border-border-light dark:border-border-dark bg-surface-light/90 dark:bg-background-dark/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Smart Nenkin Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight leading-none text-text-main-light dark:text-white">
                EXATA INDONESIA
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark mt-0.5 font-medium">
                Nenkin Calculator
              </p>
            </div>
          </div>


          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-6 text-xs font-semibold tracking-wide text-text-sub-light dark:text-text-sub-dark uppercase">
              {/* <a className="hover:text-primary transition-colors" href="#">
                Tentang
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                Panduan
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                Kontak
              </a> */}
              <button
                onClick={async () => {
                  const { createClient } = await import('@/utils/supabase/client');
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = '/login';
                }}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                Logout
                <span className="material-icons-outlined text-sm">logout</span>
              </button>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-border-light dark:border-border-dark">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-6 py-10">
        <div className="mb-12 border-b border-border-light dark:border-border-dark pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
                  Online
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3 text-text-main-light dark:text-white">
                Kalkulator Nenkin
              </h2>
              <p className="text-text-sub-light dark:text-text-sub-dark max-w-xl text-sm leading-relaxed">
                Hitung Pencairan Nenkin Anda dari sistem
                pensiun Jepang dengan presisi. <br /> Pilih jenis pensiun Anda
                disini untuk memulai estimasi.
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-black/20 p-1.5 rounded-lg border border-border-light dark:border-border-dark flex w-full md:w-auto">
              <button
                type="button"
                onClick={() => setMode("kosei")}
                className={`flex-1 md:flex-none px-8 py-3 rounded transition-all ${mode === "kosei"
                  ? "shadow-sm bg-white dark:bg-surface-dark text-primary font-bold text-sm border border-gray-200 dark:border-gray-700"
                  : "text-sm font-semibold text-text-sub-light dark:text-text-sub-dark hover:text-text-main-light dark:hover:text-text-main-dark"
                  }`}
              >
                Kōsei Nenkin
              </button>
              <button
                type="button"
                onClick={() => setMode("kokumin")}
                className={`flex-1 md:flex-none px-8 py-3 rounded transition-all ${mode === "kokumin"
                  ? "shadow-sm bg-white dark:bg-surface-dark text-primary font-bold text-sm border border-gray-200 dark:border-gray-700"
                  : "text-sm font-semibold text-text-sub-light dark:text-text-sub-dark hover:text-text-main-light dark:hover:text-text-main-dark"
                  }`}
              >
                Kokumin Nenkin
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <CalculatorCard title="Parameter Input">
              <InputForm
                mode={mode}
                averageMonthlyGrossSalary={averageMonthlyGrossSalary}
                onChangeAverageMonthlyGrossSalary={setAverageMonthlyGrossSalary}
                contributionMonths={contributionMonths}
                onChangeContributionMonths={setContributionMonths}
              />
              <button
                type="button"
                className="w-full mt-8 bg-background-light dark:bg-background-dark border border-border-light dark:border-gray-700 hover:border-primary dark:hover:border-primary text-text-main-light dark:text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all lg:hidden shadow-sm"
              >
                <span>Hitung Ulang</span>
                <span className="material-icons-outlined text-lg">refresh</span>
              </button>
            </CalculatorCard>

            <div className="p-5 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20 rounded-xl text-xs leading-relaxed text-text-sub-light dark:text-orange-200/70">
              <strong className="text-primary block mb-2 text-sm">
                Tahukah Anda?
              </strong>
              <strong>Perbedaan antara Kosei Nenkin dan Kokumin Nenkin adalah:</strong>
              <br />
              - <strong>Kosei Nenkin</strong> adalah pensiun wajib bagi karyawan yang dibayarkan dari potongan gaji setiap bulan.
              <br />
              - <strong>Kokumin Nenkin</strong> adalah pensiun wajib bagi penduduk dan karyawan yang bekerja di Jepang dan dibayarkan dari iuran setiap bulan melalui konbini atau bank.
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-8">
              <ResultDisplay mode={mode} validation={validation} result={result} />
              <TimelineEstimator
                mode={mode}
                steps={steps}
                scenario={scenario}
                onChangeScenario={setScenario}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-light dark:border-gray-800 mt-auto bg-surface-light dark:bg-surface-dark relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
            <div>
              <h5 className="text-sm font-bold text-text-main-light dark:text-white mb-3 flex items-center gap-2">
                <span className="material-icons-outlined text-sm text-primary">
                  verified_user
                </span>
                Layanan Perwakilan Pajak
              </h5>
              <p className="text-xs text-text-sub-light dark:text-gray-400 leading-relaxed max-w-md">
                Untuk mengklaim sisa pengembalian pajak 20.42%, Anda harus
                menggunakan layanan perwakilan pajak seperti EXATA INDONESIA.
              </p>
            </div>
            <div className="md:text-right">
              <h5 className="text-sm font-bold text-text-main-light dark:text-white mb-3">
                Penjelasan PENTING!
              </h5>
              <p className="text-xs text-text-sub-light dark:text-gray-400 leading-relaxed max-w-md ml-auto">
                Alat ini memberikan perkiraan berdasarkan peraturan Layanan
                Pensiun Jepang. Jumlah sebenarnya mungkin berbeda tergantung pada
                histori iuran spesifik Anda. Ini bukan nasihat hukum atau
                keuangan resmi dan jangan jadikan ini sebagai patokan utama untuk
                pengajuan klaim.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-light dark:border-gray-800">
            <p className="text-[10px] text-text-sub-light dark:text-gray-500 uppercase tracking-widest font-semibold">
              © 2026 Exata Indonesia
            </p>

            <div className="flex gap-6 mt-4 md:mt-0">
              <p className="text-[10px] text-text-sub-light dark:text-gray-500 uppercase tracking-widest font-semibold">
                Develop by <a href="https://www.noxx.tech/" target="_blank" rel="noopener noreferrer">Noxx Tech</a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/6281199896308?text=Halo%20kak%21%20saya%20ingin%20dibantu%20untuk%20pengurusan%20nenkin.%20Setelah%20pakai%20kalkulator%20nenkin%20dari%20Exata%20Indonesia%21"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#25D366] hover:bg-[#20bd59] text-white rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
        aria-label="Hubungi kami di WhatsApp"
      >
        <Image
          src="/WhatsApp.svg"
          alt="WhatsApp Logo"
          width={32}
          height={32}
          className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110"
        />
        {/* Tooltip text - visible on md and up, hidden on mobile to avoid overcrowding */}
        <span className="hidden md:inline-block absolute right-full mr-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Mulai Pengurusan Nenkin
        </span>
      </a>
    </div>
  );
}
