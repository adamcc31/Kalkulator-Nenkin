export const EXCHANGE_RATE_CACHE_KEY = "JPY_IDR_EXCHANGE_RATE" as const;
export const EXCHANGE_RATE_CACHE_TTL_SECONDS = 3600;

export interface ExchangeRateCacheEntry {
  exchangeRate: number;
  lastUpdated: number;
  expiresAt: number;
}

let exchangeRateCacheEntry: ExchangeRateCacheEntry | null = null;

export function getExchangeRateCacheEntry(): ExchangeRateCacheEntry | null {
  return exchangeRateCacheEntry;
}

export function setExchangeRateCacheEntry(params: {
  exchangeRate: number;
  lastUpdated: number;
  now?: number;
}): ExchangeRateCacheEntry {
  const now = params.now ?? Date.now();
  const expiresAt = now + EXCHANGE_RATE_CACHE_TTL_SECONDS * 1000;

  const entry: ExchangeRateCacheEntry = {
    exchangeRate: params.exchangeRate,
    lastUpdated: params.lastUpdated,
    expiresAt,
  };

  exchangeRateCacheEntry = entry;
  return entry;
}

export function isExchangeRateCacheFresh(
  entry: ExchangeRateCacheEntry,
  now: number = Date.now(),
): boolean {
  return now < entry.expiresAt;
}

