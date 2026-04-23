import omdbClient from "@/services/axios/omdbClient";
import { OMDB_ENDPOINTS } from "@/constants/endpoints";
import { AppError } from "@/lib/errors/AppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import type {
  OmdbSearchEnvelope,
  OmdbSearchResponse,
  OmdbTitleDetail,
  OmdbTitleResponse,
} from "@/types/omdb.types";

function assertOmdbSearchSuccess(data: OmdbSearchEnvelope): asserts data is OmdbSearchResponse {
  if (data.Response === "False") {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: data.Error,
      upstream: "omdb",
      retryable: false,
    });
  }
}

function assertOmdbTitleSuccess(data: OmdbTitleResponse): asserts data is OmdbTitleDetail {
  if (data.Response === "False") {
    throw new AppError({
      code: ErrorCodes.NOT_FOUND,
      message: data.Error,
      upstream: "omdb",
      retryable: false,
    });
  }
}

/**
 * OMDb title search (`?s=`). HTTP errors become `AppError` in the axios layer; logical failures
 * (`Response: "False"`) are turned into `AppError` here.
 */
export async function searchMovies(
  query: string,
  signal?: AbortSignal,
): Promise<OmdbSearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "Search query must not be empty",
      upstream: "omdb",
      retryable: false,
    });
  }

  const { data } = await omdbClient.get<OmdbSearchEnvelope>(OMDB_ENDPOINTS.root, {
    params: { s: trimmed },
    signal,
  });

  assertOmdbSearchSuccess(data);
  return data;
}

/**
 * OMDb detail by IMDb id (`?i=`).
 */
export async function getMovieByImdbId(
  imdbId: string,
  signal?: AbortSignal,
): Promise<OmdbTitleDetail> {
  const id = imdbId.trim();
  if (!id) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "imdbId must not be empty",
      upstream: "omdb",
      retryable: false,
    });
  }

  const { data } = await omdbClient.get<OmdbTitleResponse>(OMDB_ENDPOINTS.root, {
    params: { i: id },
    signal,
  });

  assertOmdbTitleSuccess(data);
  return data;
}

/**
 * OMDb detail by title (`?t=`). Same payload shape as `getMovieByImdbId`.
 */
export async function getMovieByTitle(
  title: string,
  signal?: AbortSignal,
): Promise<OmdbTitleDetail> {
  const t = title.trim();
  if (!t) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "Title must not be empty",
      upstream: "omdb",
      retryable: false,
    });
  }

  const { data } = await omdbClient.get<OmdbTitleResponse>(OMDB_ENDPOINTS.root, {
    params: { t },
    signal,
  });

  assertOmdbTitleSuccess(data);
  return data;
}
