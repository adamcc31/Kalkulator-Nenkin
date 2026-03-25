import { getDashboardStats, getMonthlyRegistrations, getUsers } from "../actions";
import StatsCard from "@/components/admin/StatsCard";
import RegistrationChart from "@/components/admin/RegistrationChart";

function formatReturnDate(dateStr: string | null): string {
    if (!dateStr) return "–";
    const [year, month] = dateStr.split("-");
    const months = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export default async function DashboardPage() {
    const [stats, monthlyData, recentUsersResult] = await Promise.all([
        getDashboardStats(),
        getMonthlyRegistrations(12),
        getUsers({ page: 1, pageSize: 10, sortBy: "created_at", sortOrder: "desc" }),
    ]);

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
                    Dashboard
                </h1>
                <p className="text-sm text-text-sub-light dark:text-text-sub-dark mt-1">
                    Ringkasan data pengguna Smart Nenkin
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Pengguna"
                    value={stats.totalUsers}
                    icon="people"
                    color="primary"
                />
                <StatsCard
                    title="Registrasi Bulan Ini"
                    value={stats.thisMonthRegistrations}
                    icon="person_add"
                    color="green"
                />
                <StatsCard
                    title="Belum Onboarding"
                    value={stats.notOnboarded}
                    icon="pending"
                    color="amber"
                />
                <StatsCard
                    title="Siswa LPK/SO"
                    value={stats.usersWithLpk}
                    icon="business"
                    color="blue"
                />
                <StatsCard
                    title="Return Terdekat"
                    value={formatReturnDate(stats.nearestReturnDate)}
                    icon="flight_land"
                    color="purple"
                />
            </div>

            {/* Chart */}
            <RegistrationChart data={monthlyData} />

            {/* Recent Users Table */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                        Pengguna Terbaru
                    </h3>
                    <a
                        href="/dashboard/users"
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Lihat Semua →
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="text-left px-5 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">Nama</th>
                                <th className="text-left px-5 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">Email</th>
                                <th className="text-left px-5 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">Return Date</th>
                                <th className="text-left px-5 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">Status</th>
                                <th className="text-left px-5 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">Tgl Registrasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {recentUsersResult.users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="px-5 py-3 text-text-main-light dark:text-text-main-dark font-medium">
                                        {user.fullname || "–"}
                                    </td>
                                    <td className="px-5 py-3 text-text-sub-light dark:text-text-sub-dark">
                                        {user.email}
                                    </td>
                                    <td className="px-5 py-3 text-text-sub-light dark:text-text-sub-dark">
                                        {formatReturnDate(user.returnDate)}
                                    </td>
                                    <td className="px-5 py-3">
                                        {user.isOnboarded ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                                Lengkap
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                                Belum Lengkap
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-text-sub-light dark:text-text-sub-dark">
                                        {formatDate(user.createdAt)}
                                    </td>
                                </tr>
                            ))}
                            {recentUsersResult.users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-text-sub-light dark:text-text-sub-dark">
                                        Belum ada pengguna terdaftar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
