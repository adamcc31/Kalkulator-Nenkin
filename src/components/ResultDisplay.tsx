"use client";

import type { NenkinMode, NenkinResult, NenkinValidation } from "@/types/nenkin";
import { useExchangeRateJPYtoIDR } from "@/hooks/useExchangeRateJPYtoIDR";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatExchangeRate(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function formatLastUpdated(timestampMs: number): string {
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestampMs) / 1000));
  if (diffSeconds < 60) return "baru saja";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

export function ResultDisplay({
  mode,
  validation,
  result,
}: {
  mode: NenkinMode;
  validation: NenkinValidation;
  result: NenkinResult | null;
}) {
  const gross = result?.amounts.gross ?? 0;
  const tax = result?.amounts.tax ?? 0;
  const net = result?.amounts.net ?? 0;
  // Perubahan: selalu gunakan gross untuk pengali kurs IDR
  const finalJPY = result ? gross : null;
  const { data: exchangeData, loading: exchangeLoading, error: exchangeError } =
    useExchangeRateJPYtoIDR();
  const estimatedIDR =
    finalJPY !== null && exchangeData ? Math.round(finalJPY * exchangeData.exchangeRate) : null;

  const exchangeRateBadge = exchangeLoading
    ? "MEMUAT"
    : exchangeError
      ? "✖ ERROR"
      : exchangeData?.source === "stale_cache"
        ? "STALE"
        : exchangeData?.source === "cache"
          ? "CACHE"
          : "⬤ LIVE";

  const exchangeRateSection = (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-text-sub-light dark:text-gray-400 mb-1 uppercase">
          Estimasi Kurs JPY → IDR
        </h4>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-mono ${exchangeRateBadge === "✖ ERROR"
            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            : exchangeRateBadge === "STALE"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
              : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            }`}
        >
          {exchangeRateBadge}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <p className="text-2xl font-display font-bold text-text-main-light dark:text-white">
          {estimatedIDR === null ? "—" : formatIDR(estimatedIDR)}
        </p>
        <p className="text-[10px] text-text-sub-light dark:text-gray-500 font-mono">
          {exchangeData ? `Kurs: ${formatExchangeRate(exchangeData.exchangeRate)}` : "Kurs: —"}
        </p>

      </div>

      <h4 className="text-xs font-bold text-text-sub-light dark:text-gray-400 mb-1 mt-1 uppercase">
        {mode === "kosei" ? "Total Estimasi (100%)" : "Estimasi Nenkin Cair"}
      </h4>

      <p className="text-[10px] text-text-sub-light dark:text-gray-500 mt-2">
        {exchangeData
          ? `Update terakhir: ${formatLastUpdated(exchangeData.lastUpdated)}`
          : exchangeError
            ? `Update terakhir: gagal memuat (${exchangeError})`
            : "Update terakhir: —"}
      </p>
      <p className="text-[10px] text-text-sub-light dark:text-gray-500 mt-3">
        Nilai IDR diatas adalah Estimasi Jumlah Dana NENKIN 100% yang ditransfer dan bersifat estimasi dan belum dipotong biaya administrasi dan pajak berdasarkan kurs terbaru dan dapat berbeda saat pencairan aktual. untuk kokumin nenkin data yang ditampilkan adalah berdasarkan tabel resmi nenkin pada tambah keterangan Pembayaran Terakhir Nenkin Kokumin April 2025 - Maret 2026.
      </p>
    </div>
  );

  if (mode === "kokumin") {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest text-text-sub-light dark:text-text-sub-dark">
            Total Estimasi Bruto
          </h3>
          {validation.message ? (
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-mono">
              {validation.message}
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono">
              ESTIMASI
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-4 mb-8">
          <span className="font-display font-bold text-6xl md:text-8xl tracking-tighter text-text-main-light dark:text-white">
            ¥ {formatNumber(gross)}
          </span>
          <span className="text-xl md:text-2xl text-text-sub-light dark:text-gray-500 font-medium">
            JPY
          </span>
        </div>

        <div className="bg-primary p-6 rounded-xl flex flex-col justify-between relative overflow-hidden shadow-lg shadow-primary/20 group">
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <h4 className="text-xs text-white/90 mb-1 uppercase tracking-wider font-bold">
                Jumlah Diterima
              </h4>
              <span className="material-icons-outlined text-white/80">
                account_balance_wallet
              </span>
            </div>
            <p className="text-4xl font-display font-bold text-white mt-2">
              ¥ {formatNumber(gross)}
            </p>
            <p className="text-xs text-white/80 mt-1">Cair sekali (100%)</p>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-3xl font-display font-bold text-white/30">NENKIN 100%</span>
            <span className="text-[10px] text-white/90 bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
              Satu Kali Cair
            </span>
          </div>
        </div>

        <div className="mt-6">{exchangeRateSection}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs uppercase tracking-widest text-text-sub-light dark:text-text-sub-dark">
          Total Estimasi Bruto
        </h3>
        {validation.message ? (
          <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-mono">
            {validation.message}
          </span>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono">
            ESTIMASI
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-4 mb-8">
        <span className="font-display font-bold text-6xl md:text-8xl tracking-tighter text-text-main-light dark:text-white">
          ¥ {formatNumber(gross)}
        </span>
        <span className="text-xl md:text-2xl text-text-sub-light dark:text-gray-500 font-medium">
          JPY
        </span>
      </div>

      <div
        className={`grid grid-cols-1 ${mode === "kosei" ? "md:grid-cols-4" : "md:grid-cols-3"
          } gap-4 mb-8`}
      >
        <div className="md:col-span-1 bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark flex flex-col justify-between relative overflow-hidden group shadow-sm">
          <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-gray-100 dark:from-gray-800 to-transparent rounded-bl-full opacity-50" />
          <div>
            <h4 className="text-xs font-bold text-text-sub-light dark:text-gray-400 mb-1 uppercase">
              PAJAK YANG DAPAT DIKEMBALIKAN
            </h4>
            <p className="text-xs font-mono text-primary bg-primary/10 inline-block px-1.5 py-0.5 rounded">
              20.42%
            </p>
          </div>
          <div className="mt-6">
            <p className="text-xl font-display font-bold text-text-main-light dark:text-white">
              ¥ {formatNumber(tax)}
            </p>
            <p className="text-[10px] text-text-sub-light dark:text-gray-500 mt-0.5">
              JPY (Dapat Diklaim Kembali)
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-primary p-6 rounded-xl flex flex-col justify-between relative overflow-hidden shadow-lg shadow-primary/20 group">
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <h4 className="text-xs text-white/90 mb-1 uppercase tracking-wider font-bold">
                Pembayaran Bersih
              </h4>
              <span className="material-icons-outlined text-white/80">
                account_balance_wallet
              </span>
            </div>
            <p className="text-4xl font-display font-bold text-white mt-2">
              ¥ {formatNumber(net)}
            </p>
            <p className="text-xs text-white/80 mt-1">
              Dana langsung ke rekening Anda
            </p>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-3xl font-display font-bold text-white/30">
              {mode === "kosei" ? "NENKIN 80%" : "NENKIN 100%"}
            </span>
            <span className="text-[10px] text-white/90 bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
              {mode === "kosei" ? "Tahap Awal" : "Sekali Cair"}
            </span>
          </div>
        </div>

        {mode === "kosei" ? (
          <div className="md:col-span-1 bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-12 h-12 bg-gradient-to-tl from-gray-100 dark:from-gray-800 to-transparent rounded-tl-full opacity-50" />
            <div>
              <h4 className="text-xs font-bold text-text-sub-light dark:text-gray-400 mb-1 uppercase">
                Pengembalian Pajak
              </h4>
              <p className="text-[10px] font-mono text-text-sub-light dark:text-gray-500">
                Klaim nanti
              </p>
            </div>
            <div className="mt-6">
              <p className="text-xl font-display font-bold text-text-main-light dark:text-white">
                ¥ {formatNumber(tax)}
              </p>
              <p className="text-[10px] text-text-sub-light dark:text-gray-500 mt-0.5">
                JPY (Butuh Perwakilan)
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {exchangeRateSection}
    </div>
  );
}
