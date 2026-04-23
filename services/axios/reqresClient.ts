import { createClient } from "@/services/axios/createClient";
import { env } from "@/lib/env";

/** This is where the Axios client for ReqRes is created. */
const reqresClient = createClient({
  upstream: "reqres",
  baseURL: env.reqresBaseUrl,
  defaultHeaders: { "x-api-key": env.reqresApiKey },
  timeoutMs: 8_000,
  attachAuth: true,
});

export default reqresClient;
