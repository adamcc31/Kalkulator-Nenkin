"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { MonthlyRegistration } from "@/types/admin";

interface RegistrationChartProps {
    data: MonthlyRegistration[];
}

function formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split("-");
    const months = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}

export default function RegistrationChart({ data }: RegistrationChartProps) {
    const chartData = data.map((d) => ({
        month: formatMonth(d.month),
        Registrasi: d.count,
    }));

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 ring-1 ring-slate-900/5 dark:ring-white/10">
            <h3 className="text-sm font-semibold text-text-main-light dark:text-text-main-dark mb-4">
                Registrasi per Bulan
            </h3>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "#94A3B8" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#94A3B8" }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "#1E293B",
                                border: "none",
                                borderRadius: "8px",
                                color: "#F1F5F9",
                                fontSize: "12px",
                            }}
                            cursor={{ fill: "rgba(255, 77, 0, 0.05)" }}
                        />
                        <Bar
                            dataKey="Registrasi"
                            fill="#FF4D00"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
