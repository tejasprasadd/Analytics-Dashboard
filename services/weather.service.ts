import weatherClient from "@/services/axios/weatherClient";
import { WEATHER_ENDPOINTS } from "@/constants/endpoints";
import { AppError } from "@/lib/errors/AppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import type { WeatherApiCurrentResponse } from "@/types/weather.types";

/**
 * Current weather for a location query (city, zip, etc.). `key` is injected by `weatherClient` defaults.
 */
export async function getWeatherByQuery(
  query: string,
  signal?: AbortSignal,
): Promise<WeatherApiCurrentResponse> {
  const q = query.trim();
  if (!q) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "Weather query must not be empty",
      upstream: "weather",
      retryable: false,
    });
  }

  const { data } = await weatherClient.get<WeatherApiCurrentResponse>(WEATHER_ENDPOINTS.current, {
    params: { q },
    signal,
  });

  return data;
}
