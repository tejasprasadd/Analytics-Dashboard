import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import { getStocks, type GetStocksParams } from "@/services/stocks.service";
import { AppError } from "@/lib/errors/AppError";

export function useStocksList(params: GetStocksParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const query = params.query?.trim() ?? "";

  return useQuery({
    queryKey: queryKeys.stocks.list(page, limit, query),
    queryFn: ({ signal }) => getStocks({ page, limit, query }, signal),
    staleTime: 60 * 60 * 1000,
    retry: (n, err) => {
      const code = err instanceof AppError ? err.code : null;
      return code !== ErrorCodes.RATE_LIMITED && n < 2;
    },
  });
}

