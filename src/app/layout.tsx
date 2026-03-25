import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kalkulatornenkin.noxx.tech'),
  title: {
    default: "Kalkulator Nenkin Jepang | Estimasi Pencairan Nenkin EXATA INDONESIA",
    template: "%s | Kalkulator Nenkin EXATA",
  },
  description: "Hitung estimasi pencairan uang pensiun (Nenkin) Jepang Anda secara akurat. Mendukung perhitungan Kōsei Nenkin dan Kokumin Nenkin dengan kurs Rupiah terbaru.",
  keywords: ["kalkulator nenkin", "pencairan nenkin", "nenkin jepang", "kosei nenkin", "kokumin nenkin", "pengembalian pajak nenkin", "exata indonesia", "cara cairkan nenkin", "hitung nenkin"],
  authors: [{ name: "PT SUMBER REZEKI EXATA INDONESIA" }],
  creator: "PT SUMBER REZEKI EXATA INDONESIA",
  publisher: "PT SUMBER REZEKI EXATA INDONESIA",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Kalkulator Nenkin Jepang | Estimasi Pencairan Nenkin EXATA INDONESIA",
    description: "Hitung estimasi pencairan uang pensiun (Nenkin) Jepang Anda secara akurat dengan kurs Rupiah terbaru. Mudah, cepat, dan transparan.",
    siteName: "Kalkulator Nenkin EXATA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalkulator Nenkin Jepang | Estimasi Pencairan Nenkin EXATA INDONESIA",
    description: "Hitung estimasi pencairan uang pensiun (Nenkin) Jepang Anda secara akurat dengan kurs Rupiah terbaru.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Kalkulator Nenkin EXATA",
  "url": "https://kalkulatornenkin.noxx.tech",
  "description": "Aplikasi web untuk menghitung estimasi pencairan uang pensiun (Nenkin) Jepang baik Kōsei maupun Kokumin Nenkin ke dalam Rupiah.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "provider": {
    "@type": "Organization",
    "name": "PT SUMBER REZEKI EXATA INDONESIA"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "IDR"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
