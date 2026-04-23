import reqresClient from "@/services/axios/reqresClient";
import { REQRES_ENDPOINTS } from "@/constants/endpoints";
import type {
  ReqResAuthRequest,
  ReqResGetUserResponse,
  ReqResLoginResponse,
  ReqResRegisterResponse,
  ReqResUserData,
} from "@/types/auth.types";

/**
 * ReqRes mock login. Does not require a Bearer token; `x-api-key` is set on the client.
 */
export async function login(
  body: ReqResAuthRequest,
  signal?: AbortSignal,
): Promise<ReqResLoginResponse> {
  const { data } = await reqresClient.post<ReqResLoginResponse>(REQRES_ENDPOINTS.login, body, {
    signal,
  });
  return data;
}

/**
 * ReqRes mock registration.
 */
export async function register(
  body: ReqResAuthRequest,
  signal?: AbortSignal,
): Promise<ReqResRegisterResponse> {
  const { data } = await reqresClient.post<ReqResRegisterResponse>(REQRES_ENDPOINTS.register, body, {
    signal,
  });
  return data;
}

/**
 * ReqRes user profile. After login, persist token so the axios interceptor can attach `Authorization`.
 */
export async function getUserProfile(
  id: number,
  signal?: AbortSignal,
): Promise<ReqResUserData> {
  const { data } = await reqresClient.get<ReqResGetUserResponse>(REQRES_ENDPOINTS.user(id), {
    signal,
  });
  return data.data;
}
