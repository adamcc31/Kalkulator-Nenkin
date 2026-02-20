"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 selection:bg-primary selection:text-white transition-colors duration-300 bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark">
            <div className="w-full max-w-[1200px] h-full min-h-[600px] md:h-[800px] bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors duration-300 ring-1 ring-slate-900/5 dark:ring-white/10">
                <div className="hidden md:flex md:w-1/2 auth-gradient relative p-12 flex-col justify-between text-white">
                    <div className="light-ray-core"></div>
                    <div className="light-rays"></div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2">
                            <span className="material-icons-outlined text-primary text-3xl">calculate</span>
                            <span className="font-bold text-lg tracking-wide">EXATA INDONESIA</span>
                        </div>
                    </div>
                    <div className="relative z-10 max-w-md mt-auto mb-12">
                        <h1 className="text-5xl font-extrabold leading-tight mb-6">
                            Kalkulator Nenkin
                        </h1>
                        <p className="text-slate-300 text-lg font-medium leading-relaxed">
                            Hitung estimasi pencairan Nenkin Anda dari sistem pensiun Jepang dengan presisi tinggi. Kelola masa depan finansial Anda sekarang.
                        </p>
                    </div>
                    <div className="relative z-10 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                        © 2026 Exata Indonesia
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-white dark:bg-slate-900">
                    <div className="absolute top-6 right-6 z-10">
                        <ThemeToggle />
                    </div>

                    <div className="md:hidden mb-8 flex items-center space-x-2 relative z-10">
                        <span className="material-icons-outlined text-primary text-3xl">calculate</span>
                        <span className="font-bold text-lg tracking-wide text-slate-900 dark:text-white">EXATA</span>
                    </div>

                    <div className="max-w-md w-full mx-auto relative z-10">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Selamat Datang!</h2>
                            <p className="text-text-sub-light dark:text-text-sub-dark">Masuk untuk mulai menghitung estimasi Nenkin Anda.</p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 mb-6 group shadow-sm disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span>{loading ? "Memproses..." : "Lanjutkan dengan Google"}</span>
                        </button>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                                Dengan masuk, Anda menyetujui <a className="underline hover:text-slate-600 dark:hover:text-slate-400" href="#">Syarat Ketentuan</a> dan <a className="underline hover:text-slate-600 dark:hover:text-slate-400" href="#">Kebijakan Privasi</a> kami.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
