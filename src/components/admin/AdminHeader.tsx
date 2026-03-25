"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface AdminHeaderProps {
    adminEmail?: string;
}

export default function AdminHeader({ adminEmail }: AdminHeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/dashboard/login");
        router.refresh();
    };

    return (
        <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 lg:px-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center space-x-2">
                <span className="material-icons-outlined text-primary text-xl">admin_panel_settings</span>
                <span className="font-bold text-sm text-text-main-light dark:text-text-main-dark">EXATA Admin</span>
            </div>

            {/* Desktop spacer */}
            <div className="hidden lg:block" />

            {/* Right side */}
            <div className="flex items-center space-x-4">
                {adminEmail && (
                    <span className="hidden sm:inline text-sm text-text-sub-light dark:text-text-sub-dark">
                        {adminEmail}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-sub-light dark:text-text-sub-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                >
                    <span className="material-icons-outlined text-lg">logout</span>
                    <span className="hidden sm:inline">Keluar</span>
                </button>
            </div>
        </header>
    );
}
