"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function submitOnboarding(formData: FormData) {
    const fullname = formData.get("fullname") as string;
    const return_date = formData.get("return_date") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const lpk = formData.get("lpk") as string;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            fullname,
            return_date,
            whatsapp,
            lpk,
            is_onboarded: true,
        })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Gagal menyimpan data Anda" };
    }

    return { success: true };
}
