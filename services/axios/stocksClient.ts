import { createClient } from "@/services/axios/createClient";
import { env } from "@/lib/env";

/** This is where the Axios client for FreeAPI stocks is created. */
const stocksClient = createClient({
  upstream: "stocks",
  baseURL: env.stocksApiBaseUrl,
});

export default stocksClient;
