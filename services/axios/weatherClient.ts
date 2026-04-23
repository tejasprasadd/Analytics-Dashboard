import { createClient } from "@/services/axios/createClient";
import { env } from "@/lib/env";

/** This is where the Axios client for WeatherAPI is created. */
const weatherClient = createClient({
  upstream: "weather",
  baseURL: env.weatherApiBaseUrl,
  defaultParams: { key: env.weatherApiKey },
});

export default weatherClient;
