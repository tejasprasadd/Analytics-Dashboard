"use client";

import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/errors/ErrorState";
import { useStocksList } from "@/hooks/queries/useStocksList";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStocksLimit, setStocksPage } from "@/store/slices/filtersSlice";

const StocksTable = memo(function StocksTable({
  rows,
}: {
  rows: { Name: string; Symbol: string; CurrentPrice: string; MarketCap: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-sm font-semibold">Stocks</div>
      <div className="mt-3 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Symbol</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2 pr-3">Market cap</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.Symbol} className="hover:bg-muted/60">
                <td className="py-2 pr-3 font-medium">{r.Name}</td>
                <td className="py-2 pr-3 text-muted-foreground">{r.Symbol}</td>
                <td className="py-2 pr-3 text-muted-foreground">{r.CurrentPrice}</td>
                <td className="py-2 pr-3 text-muted-foreground">{r.MarketCap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default function StocksPage() {
  const dispatch = useAppDispatch();
  const { stocksPage: page, stocksLimit: limit } = useAppSelector((s) => s.filters);
  const q = useStocksList({ page, limit });

  const rows = q.data?.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Stocks</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={String(limit)}
              onChange={(e) => dispatch(setStocksLimit(Number(e.target.value)))}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(setStocksPage(Math.max(1, page - 1)))}
                disabled={page <= 1}
              >
                Prev
              </Button>
              <div className="px-2 text-sm text-muted-foreground">Page {page}</div>
              <Button size="sm" variant="outline" onClick={() => dispatch(setStocksPage(page + 1))}>
                Next
              </Button>
            </div>
            <Button variant="outline" onClick={() => q.refetch()}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {q.isLoading ? (
        <Skeleton className="h-[320px]" />
      ) : q.isError ? (
        <ErrorState title="Couldn’t load stocks" error={q.error} onRetry={() => q.refetch()} />
      ) : (
        <StocksTable rows={rows} />
      )}
    </div>
  );
}

