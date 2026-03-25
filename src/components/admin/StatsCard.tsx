interface StatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    subtitle?: string;
    color?: "primary" | "green" | "amber" | "blue" | "purple";
}

const colorMap = {
    primary: {
        bg: "bg-primary/10",
        text: "text-primary",
        icon: "text-primary",
    },
    green: {
        bg: "bg-emerald-100 dark:bg-emerald-900/20",
        text: "text-emerald-600 dark:text-emerald-400",
        icon: "text-emerald-500",
    },
    amber: {
        bg: "bg-amber-100 dark:bg-amber-900/20",
        text: "text-amber-600 dark:text-amber-400",
        icon: "text-amber-500",
    },
    blue: {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
        icon: "text-blue-500",
    },
    purple: {
        bg: "bg-purple-100 dark:bg-purple-900/20",
        text: "text-purple-600 dark:text-purple-400",
        icon: "text-purple-500",
    },
};

export default function StatsCard({ title, value, icon, subtitle, color = "primary" }: StatsCardProps) {
    const colors = colorMap[color];

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 ring-1 ring-slate-900/5 dark:ring-white/10 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">{title}</p>
                    <p className="text-3xl font-bold text-text-main-light dark:text-text-main-dark mt-2">{value}</p>
                    {subtitle && (
                        <p className={`text-xs mt-1.5 font-medium ${colors.text}`}>{subtitle}</p>
                    )}
                </div>
                <div className={`${colors.bg} p-2.5 rounded-xl`}>
                    <span className={`material-icons-outlined text-2xl ${colors.icon}`}>{icon}</span>
                </div>
            </div>
        </div>
    );
}
