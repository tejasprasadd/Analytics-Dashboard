import stocksClient from "@/services/axios/stocksClient";
import { STOCKS_ENDPOINTS } from "@/constants/endpoints";
import { AppError } from "@/lib/errors/AppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import type { FreeApiStocksResponse } from "@/types/stock.types";

export interface GetStocksParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated stock list from FreeAPI. Query params are appended to the list `baseURL`.
 */
export async function getStocks(
  params: GetStocksParams,
  signal?: AbortSignal,
): Promise<FreeApiStocksResponse> { //Here promise is returning the FreeApiStocksResponse type.
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  if (page < 1 || limit < 1) {
    throw new AppError({
      code: ErrorCodes.VALIDATION,
      message: "page and limit must be positive",
      upstream: "stocks",
      retryable: false,
    });
  }

  const { data } = await stocksClient.get<FreeApiStocksResponse>(STOCKS_ENDPOINTS.list, {
    params: { page, limit },
    signal,
  });

  return data;
}
