"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [failCount, setFailCount] = useState(0);
    const [cooldown, setCooldown] = useState(0);
    const router = useRouter();

    // Client-side cooldown after 3 failures
    const startCooldown = (seconds: number) => {
        setCooldown(seconds);
        const timer = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cooldown > 0) return;

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                const newFailCount = failCount + 1;
                setFailCount(newFailCount);
                setError(data.error || "Login gagal.");

                // Client-side cooldown after 3 consecutive failures
                if (newFailCount >= 3) {
                    startCooldown(30);
                    setFailCount(0);
                }
                return;
            }

            // Success
            setFailCount(0);
            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark transition-colors duration-300">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <span className="material-icons-outlined text-primary text-4xl">admin_panel_settings</span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
                        EXATA — Admin Panel
                    </h1>
                    <p className="text-text-sub-light dark:text-text-sub-dark mt-1 text-sm">
                        Masuk ke dashboard administrasi
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl p-8 ring-1 ring-slate-900/5 dark:ring-white/10">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label
                                htmlFor="admin-email"
                                className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="admin@exata.id"
                                className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light/50 dark:placeholder:text-text-sub-dark/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="admin-password"
                                className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1.5"
                            >
                                Password
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light/50 dark:placeholder:text-text-sub-dark/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start space-x-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <span className="material-icons-outlined text-red-500 text-sm mt-0.5">error</span>
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Cooldown Warning */}
                        {cooldown > 0 && (
                            <div className="flex items-start space-x-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <span className="material-icons-outlined text-amber-500 text-sm mt-0.5">schedule</span>
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Terlalu banyak percobaan. Tunggu {cooldown} detik.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || cooldown > 0}
                            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40"
                        >
                            {loading ? (
                                <span className="inline-flex items-center space-x-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span>Memproses...</span>
                                </span>
                            ) : cooldown > 0 ? (
                                `Tunggu ${cooldown}s`
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-text-sub-light dark:text-text-sub-dark mt-6">
                    © 2026 PT Sumber Rezeki Exata Indonesia
                </p>
            </div>
        </div>
    );
}
