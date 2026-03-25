"use client";

import { useState, useTransition } from "react";
import { getUsers } from "@/app/dashboard/actions";
import type { AdminUser, UserListParams, UserListResult } from "@/types/admin";

interface UserTableProps {
    initialData: UserListResult;
    uniqueLpks: string[];
}

function formatReturnDate(dateStr: string | null): string {
    if (!dateStr) return "–";
    const [year, month] = dateStr.split("-");
    const months = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
}

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function UserTable({ initialData, uniqueLpks }: UserTableProps) {
    const [data, setData] = useState<UserListResult>(initialData);
    const [search, setSearch] = useState("");
    const [filterOnboarded, setFilterOnboarded] = useState<string>("all");
    const [filterLpk, setFilterLpk] = useState("");
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isPending, startTransition] = useTransition();

    const fetchData = (overrides: Partial<UserListParams> = {}) => {
        const params: UserListParams = {
            page: overrides.page ?? currentPage,
            pageSize: overrides.pageSize ?? pageSize,
            search: overrides.search ?? search,
            filterOnboarded:
                (overrides.filterOnboarded !== undefined
                    ? overrides.filterOnboarded
                    : filterOnboarded === "all"
                        ? null
                        : filterOnboarded === "true"),
            filterLpk: overrides.filterLpk ?? filterLpk,
            sortBy: overrides.sortBy ?? sortBy,
            sortOrder: overrides.sortOrder ?? sortOrder,
        };

        startTransition(async () => {
            const result = await getUsers(params);
            setData(result);
        });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
        fetchData({ search: value, page: 1 });
    };

    const handleFilterOnboarded = (value: string) => {
        setFilterOnboarded(value);
        setCurrentPage(1);
        fetchData({
            filterOnboarded: value === "all" ? null : value === "true",
            page: 1,
        });
    };

    const handleFilterLpk = (value: string) => {
        setFilterLpk(value);
        setCurrentPage(1);
        fetchData({ filterLpk: value, page: 1 });
    };

    const handleSort = (column: string) => {
        const newOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc";
        setSortBy(column);
        setSortOrder(newOrder);
        fetchData({ sortBy: column, sortOrder: newOrder });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchData({ page });
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
        fetchData({ pageSize: size, page: 1 });
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortBy !== column) return <span className="material-icons-outlined text-xs opacity-30">unfold_more</span>;
        return (
            <span className="material-icons-outlined text-xs text-primary">
                {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
            </span>
        );
    };

    return (
        <div className="space-y-4">
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light dark:text-text-sub-dark text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau no. WA..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-sm text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={filterOnboarded}
                    onChange={(e) => handleFilterOnboarded(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-sm text-text-main-light dark:text-text-main-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="all">Semua Status</option>
                    <option value="true">Lengkap</option>
                    <option value="false">Belum Lengkap</option>
                </select>

                {/* LPK Filter */}
                <select
                    value={filterLpk}
                    onChange={(e) => handleFilterLpk(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-sm text-text-main-light dark:text-text-main-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="">Semua LPK</option>
                    {uniqueLpks.map((lpk) => (
                        <option key={lpk} value={lpk}>{lpk}</option>
                    ))}
                </select>

                {/* Page Size */}
                <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-sm text-text-main-light dark:text-text-main-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value={25}>25 / hal</option>
                    <option value={50}>50 / hal</option>
                    <option value={100}>100 / hal</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden relative">
                {isPending && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-10 flex items-center justify-center">
                        <div className="flex items-center space-x-2 text-sm text-text-sub-light dark:text-text-sub-dark">
                            <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Memuat...</span>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="text-left px-4 py-3 font-medium text-text-sub-light dark:text-text-sub-dark w-8">#</th>
                                <th
                                    className="text-left px-4 py-3 font-medium text-text-sub-light dark:text-text-sub-dark cursor-pointer hover:text-text-main-light dark:hover:text-text-main-dark"
                                    onClick={() => handleSort("fullname")}
                                >
                                    <span className="inline-flex items-center space-x-1">
                                        <span>Nama</span>
                                        <SortIcon column="fullname" />
                                    </span>
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">Email</th>
                                <th
                                    className="text-left px-4 py-3 font-medium text-text-sub-light dark:text-text-sub-dark cursor-pointer hover:text-text-main-light dark:hover:text-text-main-dark"
                                    onClick={() => handleSort("return_date")}
                                >
                                    <span className="inline-flex items-center space-x-1">
                                        <span>Return Date</span>
                                        <SortIcon column="return_date" />
                                    </span>
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">WhatsApp</th>
                                <th className="text-left px-4 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">LPK/SO</th>
                                <th className="text-left px-4 py-3 font-medium text-text-sub-light dark:text-text-sub-dark">Status</th>
                                <th
                                    className="text-left px-4 py-3 font-medium text-text-sub-light dark:text-text-sub-dark cursor-pointer hover:text-text-main-light dark:hover:text-text-main-dark"
                                    onClick={() => handleSort("created_at")}
                                >
                                    <span className="inline-flex items-center space-x-1">
                                        <span>Tgl Registrasi</span>
                                        <SortIcon column="created_at" />
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {data.users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="px-4 py-3 text-text-sub-light dark:text-text-sub-dark">
                                        {(data.page - 1) * data.pageSize + index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-text-main-light dark:text-text-main-dark font-medium whitespace-nowrap">
                                        {user.fullname || "–"}
                                    </td>
                                    <td className="px-4 py-3 text-text-sub-light dark:text-text-sub-dark">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3 text-text-sub-light dark:text-text-sub-dark whitespace-nowrap">
                                        {formatReturnDate(user.returnDate)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.whatsapp ? (
                                            <a
                                                href={`https://wa.me/${user.whatsapp.replace(/[^0-9]/g, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
                                            >
                                                {user.whatsapp}
                                            </a>
                                        ) : (
                                            <span className="text-text-sub-light dark:text-text-sub-dark">–</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-text-sub-light dark:text-text-sub-dark">
                                        {user.lpk || "–"}
                                    </td>
                                    <td className="px-4 py-3">
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
                                    <td className="px-4 py-3 text-text-sub-light dark:text-text-sub-dark whitespace-nowrap">
                                        {formatDateTime(user.createdAt)}
                                    </td>
                                </tr>
                            ))}
                            {data.users.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-text-sub-light dark:text-text-sub-dark">
                                        Tidak ada data yang sesuai filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                        Menampilkan {(data.page - 1) * data.pageSize + 1}–{Math.min(data.page * data.pageSize, data.total)} dari {data.total} pengguna
                    </p>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-2 py-1 rounded-lg text-sm text-text-sub-light dark:text-text-sub-dark hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-icons-outlined text-lg">chevron_left</span>
                        </button>
                        {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                            let pageNum: number;
                            if (data.totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= data.totalPages - 2) {
                                pageNum = data.totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                        ? "bg-primary text-white"
                                        : "text-text-sub-light dark:text-text-sub-dark hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= data.totalPages}
                            className="px-2 py-1 rounded-lg text-sm text-text-sub-light dark:text-text-sub-dark hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-icons-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
