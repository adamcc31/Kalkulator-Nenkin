import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | EXATA Indonesia",
    robots: { index: false, follow: false },
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side auth check (defense in depth alongside middleware)
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/dashboard/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader adminEmail={user.email} />
                <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
