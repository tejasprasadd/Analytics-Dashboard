import dummyJsonClient from "@/services/axios/dummyJsonClient";
import { DUMMYJSON_ENDPOINTS } from "@/constants/endpoints";
import { AppError } from "@/lib/errors/AppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import type { DummyJsonPost, DummyJsonPostsResponse } from "@/types/post.types";
import type { DummyJsonCommentsResponse } from "@/types/comment.types";

export interface ListPostsParams {
  page?: number;
  limit?: number;
  q?: string;
}

function toSkip(page: number, limit: number): number {
  return Math.max(0, (page - 1) * limit);
}

/** Paginated list of all posts. */
export async function getPosts(
  params: ListPostsParams,
  signal?: AbortSignal,
): Promise<DummyJsonPostsResponse> {
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
  const url = q ? DUMMYJSON_ENDPOINTS.posts.search : DUMMYJSON_ENDPOINTS.posts.list;
  const query: Record<string, string | number> = { limit, skip: toSkip(page, limit) };
  if (q) query.q = q;

  const { data } = await dummyJsonClient.get<DummyJsonPostsResponse>(url, {
    params: query,
    signal,
  });
  return data;
}

/** Single post by id. */
export async function getPostById(
  id: number,
  signal?: AbortSignal,
): Promise<DummyJsonPost> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "post id must be a positive number",
      upstream: "dummyJson",
      retryable: false,
    });
  }

  const { data } = await dummyJsonClient.get<DummyJsonPost>(
    DUMMYJSON_ENDPOINTS.posts.byId(id),
    { signal },
  );
  return data;
}

/**
 * Comments attached to a post. This is the second hop of the
 * user → posts → comments chain.
 */
export async function getCommentsByPost(
  postId: number,
  signal?: AbortSignal,
): Promise<DummyJsonCommentsResponse> {
  if (!Number.isFinite(postId) || postId <= 0) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "postId must be a positive number",
      upstream: "dummyJson",
      retryable: false,
    });
  }

  const { data } = await dummyJsonClient.get<DummyJsonCommentsResponse>(
    DUMMYJSON_ENDPOINTS.posts.commentsByPost(postId),
    { signal },
  );
  return data;
}
