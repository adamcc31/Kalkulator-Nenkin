import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalkulatornenkin.noxx.tech';

    return [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/onboarding`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}
