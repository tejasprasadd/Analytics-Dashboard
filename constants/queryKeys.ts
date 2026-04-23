export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    root: ["users"] as const,
    all: ["users"] as const,
    detail: (id: number) => ["users", id] as const,
  },
  posts: {
    root: ["posts"] as const,
    all: ["posts"] as const,
    byUser: (userId: number) => ["posts", "user", userId] as const,
    infinite: ["posts", "infinite"] as const,
    detail: (id: number) => ["posts", id] as const,
  },
  comments: {
    root: ["comments"] as const,
    byPost: (postId: number) => ["comments", "post", postId] as const,
  },
  countries: {
    root: ["countries"] as const,
    all: ["countries"] as const,
    byRegion: (region: string) => ["countries", "region", region] as const,
  },
  weather: {
    root: ["weather"] as const,
    byCity: (city: string) => ["weather", city] as const,
  },
  stocks: {
    root: ["stocks"] as const,
    timeSeries: (symbol: string) => ["stocks", "timeSeries", symbol] as const,
    quote: (symbol: string) => ["stocks", "quote", symbol] as const,
  },
} as const;

