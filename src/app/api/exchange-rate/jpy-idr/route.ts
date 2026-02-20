import { NextResponse } from "next/server";
import {
  EXCHANGE_RATE_CACHE_TTL_SECONDS,
  getExchangeRateCacheEntry,
  isExchangeRateCacheFresh,
  setExchangeRateCacheEntry,
} from "@/lib/server/exchangeRateCache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FRANKFURTER_URL = "https://api.frankfurter.app/latest?from=JPY&to=IDR";
const FETCH_TIMEOUT_MS = 8000;

type FrankfurterResponse = {
  amount: number;
  base: string;
  date: string;
  rates: { IDR?: number };
};

async function fetchJPYtoIDRFromFrankfurter(now: number): Promise<{
  exchangeRate: number;
  frankfurterDate: string;
  lastUpdated: number;
}> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(FRANKFURTER_URL, {
      method: "GET",
      signal: abortController.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Frankfurter error: ${response.status}`);
    }

    const data = (await response.json()) as FrankfurterResponse;
    const exchangeRate = data?.rates?.IDR;
    const frankfurterDate = data?.date;

    if (typeof exchangeRate !== "number" || !Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      throw new Error("Invalid Frankfurter exchange rate payload");
    }

    if (typeof frankfurterDate !== "string" || frankfurterDate.length < 8) {
      throw new Error("Invalid Frankfurter date payload");
    }

    return { exchangeRate, frankfurterDate, lastUpdated: now };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET() {
  const now = Date.now();
  const cached = getExchangeRateCacheEntry();

  if (cached && isExchangeRateCacheFresh(cached, now)) {
    return NextResponse.json(
      {
        exchangeRate: cached.exchangeRate,
        lastUpdated: cached.lastUpdated,
        ttlSeconds: EXCHANGE_RATE_CACHE_TTL_SECONDS,
        source: "cache" as const,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Exchange-Rate-Source": "cache",
        },
      },
    );
  }

  try {
    const fresh = await fetchJPYtoIDRFromFrankfurter(now);
    setExchangeRateCacheEntry({
      exchangeRate: fresh.exchangeRate,
      lastUpdated: fresh.lastUpdated,
      now,
    });

    return NextResponse.json(
      {
        exchangeRate: fresh.exchangeRate,
        lastUpdated: fresh.lastUpdated,
        frankfurterDate: fresh.frankfurterDate,
        ttlSeconds: EXCHANGE_RATE_CACHE_TTL_SECONDS,
        source: "origin" as const,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Exchange-Rate-Source": "origin",
        },
      },
    );
  } catch {
    if (cached) {
      return NextResponse.json(
        {
          exchangeRate: cached.exchangeRate,
          lastUpdated: cached.lastUpdated,
          ttlSeconds: EXCHANGE_RATE_CACHE_TTL_SECONDS,
          source: "stale_cache" as const,
        },
        {
          headers: {
            "Cache-Control": "no-store",
            "X-Exchange-Rate-Source": "stale_cache",
          },
        },
      );
    }

    return NextResponse.json(
      {
        error: "EXCHANGE_RATE_UNAVAILABLE",
        message: "Kurs JPY→IDR sedang tidak tersedia. Silakan coba beberapa saat lagi.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

