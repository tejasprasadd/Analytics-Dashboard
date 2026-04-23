import dummyJsonClient from "@/services/axios/dummyJsonClient";
import { DUMMYJSON_ENDPOINTS } from "@/constants/endpoints";
import { AppError } from "@/lib/errors/AppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import type { DummyJsonUser, DummyJsonUsersResponse } from "@/types/user.types";
import type { DummyJsonPostsResponse } from "@/types/post.types";

export interface ListUsersParams {
  /** 1-based page in our UI; converted to `skip` for DummyJSON. */
  page?: number;
  limit?: number;
  /** Optional search query. When present, hits `/users/search`. */
  q?: string;
}

function toSkip(page: number, limit: number): number {
  return Math.max(0, (page - 1) * limit);
}

/**
 * Paginated list of users. If `q` is provided, uses the search endpoint instead.
 * DummyJSON pagination uses `limit` + `skip`; we expose a 1-based `page` for the UI.
 */
export async function getUsers(
  params: ListUsersParams,
  signal?: AbortSignal,
): Promise<DummyJsonUsersResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  if (page < 1 || limit < 1) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "page and limit must be positive",
      upstream: "dummyJson",
      retryable: false,
    });
  }

  const q = params.q?.trim() ?? "";
  const url = q ? DUMMYJSON_ENDPOINTS.users.search : DUMMYJSON_ENDPOINTS.users.list;
  const query: Record<string, string | number> = { limit, skip: toSkip(page, limit) };
  if (q) query.q = q;

  const { data } = await dummyJsonClient.get<DummyJsonUsersResponse>(url, {
    params: query,
    signal,
  });
  return data;
}

/** Single user by id. */
export async function getUserById(
  id: number,
  signal?: AbortSignal,
): Promise<DummyJsonUser> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "user id must be a positive number",
      upstream: "dummyJson",
      retryable: false,
    });
  }

  const { data } = await dummyJsonClient.get<DummyJsonUser>(
    DUMMYJSON_ENDPOINTS.users.byId(id),
    { signal },
  );
  return data;
}

/**
 * Posts authored by a given user. This is the first hop in the
 * user → posts → comments relationship the dashboard visualises.
 */
export async function getPostsByUser(
  userId: number,
  signal?: AbortSignal,
): Promise<DummyJsonPostsResponse> {
  if (!Number.isFinite(userId) || userId <= 0) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "userId must be a positive number",
      upstream: "dummyJson",
      retryable: false,
    });
  }

  const { data } = await dummyJsonClient.get<DummyJsonPostsResponse>(
    DUMMYJSON_ENDPOINTS.users.postsByUser(userId),
    { signal },
  );
  return data;
}
