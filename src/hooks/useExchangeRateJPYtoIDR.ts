"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ExchangeRateSource = "origin" | "cache" | "stale_cache";

export interface ExchangeRateJPYtoIDR {
  exchangeRate: number;
  lastUpdated: number;
  ttlSeconds: number;
  source: ExchangeRateSource;
  frankfurterDate?: string;
}

export interface UseExchangeRateJPYtoIDRState {
  data: ExchangeRateJPYtoIDR | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const FETCH_TIMEOUT_MS = 8000;

function getMessageField(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  if (!("message" in payload)) return null;
  const message = (payload as Record<string, unknown>).message;
  return typeof message === "string" ? message : null;
}

async function fetchWithTimeout(input: string, timeoutMs: number): Promise<Response> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
  try {
    return await fetch(input, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: abortController.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export function useExchangeRateJPYtoIDR(): UseExchangeRateJPYtoIDRState {
  const [data, setData] = useState<ExchangeRateJPYtoIDR | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const didInitRef = useRef(false);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithTimeout("/api/exchange-rate/jpy-idr", FETCH_TIMEOUT_MS);
      const json = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error(getMessageField(json) ?? "Gagal memuat kurs JPY→IDR.");
      }

      const parsed = json as ExchangeRateJPYtoIDR;
      if (typeof parsed?.exchangeRate !== "number" || !Number.isFinite(parsed.exchangeRate)) {
        throw new Error("Payload kurs tidak valid.");
      }
      if (typeof parsed?.lastUpdated !== "number" || !Number.isFinite(parsed.lastUpdated)) {
        throw new Error("Payload timestamp kurs tidak valid.");
      }
      if (typeof parsed?.ttlSeconds !== "number" || !Number.isFinite(parsed.ttlSeconds)) {
        throw new Error("Payload TTL kurs tidak valid.");
      }

      setData(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat kurs JPY→IDR.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const lastUpdated = data?.lastUpdated;
    const ttlSeconds = data?.ttlSeconds;
    if (lastUpdated === undefined || ttlSeconds === undefined) return;
    if (!Number.isFinite(lastUpdated) || !Number.isFinite(ttlSeconds)) return;

    const refreshAt = lastUpdated + ttlSeconds * 1000;
    const delayMs = Math.max(60_000, refreshAt - Date.now() + 1000);

    const timeoutId = window.setTimeout(() => {
      void refetch();
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [data?.lastUpdated, data?.ttlSeconds, refetch]);

  return { data, loading, error, refetch };
}
