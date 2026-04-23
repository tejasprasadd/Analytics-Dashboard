import dummyJsonClient from "@/services/axios/dummyJsonClient";
import { DUMMYJSON_ENDPOINTS } from "@/constants/endpoints";
import { AppError } from "@/lib/errors/AppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import type {
  DummyJsonComment,
  DummyJsonCommentsResponse,
} from "@/types/comment.types";

export interface ListCommentsParams {
  page?: number;
  limit?: number;
}

function toSkip(page: number, limit: number): number {
  return Math.max(0, (page - 1) * limit);
}

/** Paginated list of all comments across all posts. */
export async function getComments(
  params: ListCommentsParams,
  signal?: AbortSignal,
): Promise<DummyJsonCommentsResponse> {
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

  const { data } = await dummyJsonClient.get<DummyJsonCommentsResponse>(
    DUMMYJSON_ENDPOINTS.comments.list,
    { params: { limit, skip: toSkip(page, limit) }, signal },
  );
  return data;
}

/** Single comment by id. */
export async function getCommentById(
  id: number,
  signal?: AbortSignal,
): Promise<DummyJsonComment> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "comment id must be a positive number",
      upstream: "dummyJson",
      retryable: false,
    });
  }

  const { data } = await dummyJsonClient.get<DummyJsonComment>(
    DUMMYJSON_ENDPOINTS.comments.byId(id),
    { signal },
  );
  return data;
}
