/**
 * Client-safe env. Missing keys are empty strings; callers (hooks/UI) can show a
 * "missing key" state instead of crashing the bundle.
 */
function trimTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

export const env = {
  dummyJsonBaseUrl: trimTrailingSlashes(
    process.env.NEXT_PUBLIC_DUMMYJSON_API_BASE_URL ?? "https://dummyjson.com",
  ),

  weatherApiBaseUrl: trimTrailingSlashes(
    process.env.NEXT_PUBLIC_WEATHER_API_BASE_URL ?? "https://api.weatherapi.com/v1",
  ),
  weatherApiKey: process.env.NEXT_PUBLIC_WEATHER_API_KEY ?? "",

  stocksApiBaseUrl: trimTrailingSlashes(
    process.env.NEXT_PUBLIC_STOCKS_API_BASE_URL ??
      "https://api.freeapi.app/api/v1/public/stocks",
  ),

  reqresBaseUrl: trimTrailingSlashes(
    process.env.NEXT_PUBLIC_REQRES_API_BASE_URL ?? "https://reqres.in/api",
  ),
  reqresApiKey: process.env.NEXT_PUBLIC_REQRES_API_KEY ?? "",

  enableDevtools: process.env.NODE_ENV !== "production",

  collabSimIntervalMs: Number(process.env.NEXT_PUBLIC_COLLAB_SIM_INTERVAL_MS ?? 8_000),
};

if (process.env.NODE_ENV !== "production") {
  if (!env.weatherApiKey) console.warn("[env] NEXT_PUBLIC_WEATHER_API_KEY is not set");
  if (!env.reqresApiKey) console.warn("[env] NEXT_PUBLIC_REQRES_API_KEY is not set");
}
