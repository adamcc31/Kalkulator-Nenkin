"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: "dashboard",
    },
    {
        href: "/dashboard/users",
        label: "Pengguna",
        icon: "group",
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-[260px] min-h-screen bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center space-x-2">
                        <span className="material-icons-outlined text-primary text-2xl">admin_panel_settings</span>
                        <div>
                            <span className="font-bold text-sm tracking-wide text-text-main-light dark:text-text-main-dark">
                                EXATA
                            </span>
                            <span className="text-xs text-text-sub-light dark:text-text-sub-dark ml-1.5">Admin</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-text-sub-light dark:text-text-sub-dark hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-main-light dark:hover:text-text-main-dark"
                                }`}
                            >
                                <span className={`material-icons-outlined text-xl ${isActive ? "text-primary" : ""}`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-4 py-4 border-t border-border-light dark:border-border-dark">
                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark text-center">
                        Smart Nenkin v0.1.0
                    </p>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium transition-colors ${
                                isActive
                                    ? "text-primary"
                                    : "text-text-sub-light dark:text-text-sub-dark"
                            }`}
                        >
                            <span className="material-icons-outlined text-xl mb-0.5">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
