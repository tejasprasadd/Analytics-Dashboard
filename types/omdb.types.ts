export interface OmdbRating {
  Source: string;
  Value: string;
}

/**
 * OMDb "movie/series/episode detail" response (e.g. `/?t=fight%20club` or `/?i=tt0137523`).
 * Note: OMDb returns most numeric-ish fields as strings (e.g. "Year", "imdbRating").
 */
export interface OmdbTitleDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OmdbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: "movie" | "series" | "episode" | string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: "True";
}

/**
 * OMDb error envelope when `Response` is "False".
 * Example: `{ "Response": "False", "Error": "Movie not found!" }`
 */
export interface OmdbErrorResponse {
  Response: "False";
  Error: string;
}

export type OmdbTitleResponse = OmdbTitleDetail | OmdbErrorResponse;

/**
 * OMDb search result row from `/?s=<query>`.
 */
export interface OmdbSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie" | "series" | "episode" | string;
  Poster: string;
}

/**
 * OMDb search response envelope from `/?s=<query>`.
 */
export interface OmdbSearchResponse {
  Search: OmdbSearchItem[];
  totalResults: string;
  Response: "True";
}

export type OmdbSearchEnvelope = OmdbSearchResponse | OmdbErrorResponse;

