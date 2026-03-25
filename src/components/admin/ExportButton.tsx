"use client";

import { useState } from "react";

export default function ExportButton() {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleExport = async () => {
        setShowConfirm(false);
        setLoading(true);

        try {
            const res = await fetch("/api/admin/export", {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error("Export failed");
            }

            // Trigger download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch {
            alert("Gagal mengekspor data. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 shadow-sm"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Mengekspor...</span>
                    </>
                ) : (
                    <>
                        <span className="material-icons-outlined text-lg">file_download</span>
                        <span>Export CSV</span>
                    </>
                )}
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 ring-1 ring-slate-900/5 dark:ring-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="material-icons-outlined text-amber-500 text-2xl">warning</span>
                            <h3 className="font-semibold text-text-main-light dark:text-text-main-dark">
                                Konfirmasi Ekspor
                            </h3>
                        </div>
                        <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-6">
                            Data yang diekspor berisi informasi pribadi pengguna (nama, email, nomor WA). Pastikan data ini ditangani sesuai kebijakan privasi.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-text-sub-light dark:text-text-sub-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                            >
                                Ya, Ekspor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
