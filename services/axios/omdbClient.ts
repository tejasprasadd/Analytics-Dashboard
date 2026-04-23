import { createClient } from "@/services/axios/createClient";
import { env } from "@/lib/env";

/** This is where the Axios client for OMDb is created. */
const omdbClient = createClient({
  upstream: "omdb",
  baseURL: env.omdbBaseUrl,
  defaultParams: { apikey: env.omdbApiKey },
});

export default omdbClient;
