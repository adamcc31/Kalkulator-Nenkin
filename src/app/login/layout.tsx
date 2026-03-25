import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Masuk",
    description: "Masuk ke akun EXATA INDONESIA Anda untuk mulai menghitung estimasi pencairan Nenkin.",
    alternates: {
        canonical: "/login",
    },
    openGraph: {
        title: "Masuk | Kalkulator Nenkin EXATA",
        description: "Masuk ke akun EXATA INDONESIA Anda untuk mulai menghitung estimasi pencairan Nenkin.",
        url: "/login",
    },
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
