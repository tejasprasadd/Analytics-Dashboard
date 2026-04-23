import { createClient } from "@/services/axios/createClient";
import { env } from "@/lib/env";

/**
 * Axios instance for the DummyJSON API (users, posts, comments).
 * No API key required; no auth attached.
 */
const dummyJsonClient = createClient({
  upstream: "dummyJson",
  baseURL: env.dummyJsonBaseUrl,
});

export default dummyJsonClient;
