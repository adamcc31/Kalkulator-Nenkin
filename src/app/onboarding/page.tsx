"use client";

import { useState } from "react";
import { submitOnboarding } from "./actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function OnboardingPage() {
    const [loading, setLoading] = useState(false);
    const [phonePrefix, setPhonePrefix] = useState("+62");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        // Gabungkan prefix dan nomor whatsapp yang dikirim
        const waNumber = formData.get("whatsapp") as string;
        formData.set("whatsapp", `${phonePrefix}${waNumber.replace(/^0+/, '')}`); // Hapus 0 di depan jika ada

        try {
            const result = await submitOnboarding(formData);
            if (result.success) {
                window.location.href = "/";
            } else {
                alert(result.error || "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Terjadi kesalahan sistem. Silakan coba lagi.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 selection:bg-primary selection:text-white transition-colors duration-300 bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark">
            <div className="w-full max-w-[600px] bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 ring-1 ring-slate-900/5 dark:ring-white/10 relative">
                <div className="absolute top-6 right-6 z-10">
                    <ThemeToggle />
                </div>

                <div className="pt-8 px-8 md:px-12 pb-2">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <span className="material-icons-outlined text-primary text-3xl">calculate</span>
                        <span className="font-bold text-lg tracking-wide text-slate-900 dark:text-white">EXATA INDONESIA</span>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Informasi Dasar</h2>
                        <p className="text-text-sub-light dark:text-text-sub-dark text-sm md:text-base">Lengkapi data diri Anda untuk memulai estimasi.</p>
                    </div>
                </div>

                <div className="p-8 md:px-12 md:pb-12 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="fullname">Nama Lengkap</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-outlined text-slate-400">person</span>
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all dark:text-white placeholder-slate-400"
                                    id="fullname"
                                    name="fullname"
                                    placeholder="Contoh: Budi Santoso"
                                    required
                                    type="text"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="return_date">Estimasi Kepulangan</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-outlined text-slate-400">calendar_month</span>
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all dark:text-white placeholder-slate-400 appearance-none"
                                    id="return_date"
                                    name="return_date"
                                    required
                                    type="month"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Bulan dan tahun rencana pulang ke Indonesia</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="whatsapp">Nomor Whatsapp Aktif</label>
                            <div className="flex">
                                <select
                                    value={phonePrefix}
                                    onChange={(e) => setPhonePrefix(e.target.value)}
                                    className="inline-flex items-center pl-4 pr-8 py-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 sm:text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: `right .5rem center`,
                                        backgroundRepeat: `no-repeat`,
                                        backgroundSize: `1.5em 1.5em`
                                    }}
                                >
                                    <option value="+62">ID (+62)</option>
                                    <option value="+81">JP (+81)</option>
                                </select>
                                <input
                                    className="w-full px-4 py-3 rounded-r-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all dark:text-white placeholder-slate-400"
                                    id="whatsapp"
                                    name="whatsapp"
                                    placeholder="81234567890"
                                    required
                                    type="tel"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="lpk">LPK (Lembaga Pelatihan Kerja)</label>
                                <span className="text-xs text-slate-400 italic mt-0.5">Opsional</span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-outlined text-slate-400">business</span>
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all dark:text-white placeholder-slate-400"
                                    id="lpk"
                                    name="lpk"
                                    placeholder="Nama LPK Pengirim"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:-translate-y-0.5 active:translate-y-0 hover:bg-[#e04800] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-200 transform flex items-center justify-center space-x-2 group disabled:opacity-50"
                            >
                                <span>{loading ? "Menyimpan..." : "Selanjutnya"}</span>
                                <span className="material-icons-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => window.location.href = '/login'}
                                className="w-full mt-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium py-2 transition-colors"
                            >
                                Kembali ke Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
