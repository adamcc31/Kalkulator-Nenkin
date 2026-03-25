import { getUsers, getUniqueLpks } from "../../actions";
import UserTable from "@/components/admin/UserTable";
import ExportButton from "@/components/admin/ExportButton";

export default async function UsersPage() {
    const [initialData, uniqueLpks] = await Promise.all([
        getUsers({
            page: 1,
            pageSize: 25,
            sortBy: "created_at",
            sortOrder: "desc",
        }),
        getUniqueLpks(),
    ]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
                        Daftar Pengguna
                    </h1>
                    <p className="text-sm text-text-sub-light dark:text-text-sub-dark mt-1">
                        Kelola dan pantau semua pengguna Smart Nenkin
                    </p>
                </div>
                <ExportButton />
            </div>

            {/* User Table */}
            <UserTable initialData={initialData} uniqueLpks={uniqueLpks} />
        </div>
    );
}
