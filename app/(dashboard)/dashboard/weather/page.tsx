"use client";

import Image from "next/image";
import { memo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/errors/ErrorState";
import { useWeatherCurrent } from "@/hooks/queries/useWeatherCurrent";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setWeatherQuery } from "@/store/slices/filtersSlice";

function iconUrl(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("//")) return "https:" + raw;
  return raw;
}

//React memo memoizing the card component so that it does not re-render when the props are the same.
const WeatherCard = memo(function WeatherCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
});

export default function WeatherPage() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((s) => s.filters.weatherQuery);
  const [draft, setDraft] = useState(query);
  const q = useWeatherCurrent(query);

  const location = q.data?.location;
  const current = q.data?.current;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Weather</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Polls real WeatherAPI current conditions from the WeatherAPI.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              className="h-9 w-72 max-w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="City (e.g. Delhi)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") dispatch(setWeatherQuery(draft));
              }}
            />
            <Button
              variant="outline"
              onClick={() => dispatch(setWeatherQuery(draft))}
              disabled={!draft.trim()}
            >
              Search
            </Button>
            <Button variant="outline" onClick={() => q.refetch()} disabled={!query.trim()}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {q.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[92px]" />
          <Skeleton className="h-[92px]" />
          <Skeleton className="h-[92px]" />
          <Skeleton className="h-[92px]" />
        </div>
      ) : q.isError ? (
        <ErrorState title="Couldn’t load weather" error={q.error} onRetry={() => q.refetch()} />
      ) : current && location ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
            {current.condition.icon ? (
              <Image
                src={iconUrl(current.condition.icon)}
                alt={current.condition.text}
                width={40}
                height={40}
              />
            ) : null}
            <div>
              <div className="text-sm font-semibold">
                {location.name}, {location.country}
              </div>
              <div className="text-sm text-muted-foreground">{current.condition.text}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <WeatherCard title="Temp (°C)" value={String(current.temp_c)} />
            <WeatherCard title="Humidity (%)" value={String(current.humidity)} />
            <WeatherCard title="Wind (kph)" value={String(current.wind_kph)} />
            <WeatherCard title="Feels like (°C)" value={String(current.feelslike_c)} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
          Enter a location query to load weather.
        </div>
      )}
    </div>
  );
}

