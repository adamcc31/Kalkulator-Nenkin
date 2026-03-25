import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lengkapi Data Diri",
    description: "Lengkapi profil Anda untuk mengoptimalkan perhitungan estimasi pencairan Nenkin (Uang Pensiun Jepang) Anda.",
    alternates: {
        canonical: "/onboarding",
    },
    openGraph: {
        title: "Lengkapi Data Diri | Kalkulator Nenkin EXATA",
        description: "Lengkapi profil Anda untuk mengoptimalkan perhitungan estimasi pencairan Nenkin (Uang Pensiun Jepang) Anda.",
        url: "/onboarding",
    },
};

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
