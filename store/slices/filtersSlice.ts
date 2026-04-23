import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Filters slice drives all read-only data fetching across the dashboard.
 *
 * DummyJSON relational view (users → posts → comments):
 *   - `userSearchQuery`, `usersPage`, `usersLimit` power the users list/chart.
 *   - `selectedUserId` selects a user; the posts panel then fetches that user's posts.
 *   - `selectedPostId` selects a post; the comments panel then fetches that post's comments.
 *
 * Weather & stocks remain simple value-in, list-out filters.
 */
export interface FiltersState {
  // WeatherAPI
  weatherQuery: string;

  // FreeAPI stocks pagination
  stocksPage: number;
  stocksLimit: number;
  stocksQuery: string;

  // DummyJSON users → posts → comments chain
  userSearchQuery: string;
  usersPage: number;
  usersLimit: number;
  selectedUserId: number | null;
  selectedPostId: number | null;
}

export const INITIAL_FILTERS: FiltersState = {
  weatherQuery: "",
  stocksPage: 1,
  stocksLimit: 10,
  stocksQuery: "",
  userSearchQuery: "",
  usersPage: 1,
  usersLimit: 10,
  selectedUserId: null,
  selectedPostId: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState: INITIAL_FILTERS,
  reducers: {
    setWeatherQuery(state, action: PayloadAction<string>) {
      state.weatherQuery = action.payload;
    },
    setStocksPage(state, action: PayloadAction<number>) {
      state.stocksPage = action.payload;
    },
    setStocksLimit(state, action: PayloadAction<number>) {
      state.stocksLimit = action.payload;
    },
    setStocksQuery(state, action: PayloadAction<string>) {
      state.stocksQuery = action.payload;
      state.stocksPage = 1;
    },

    setUserSearchQuery(state, action: PayloadAction<string>) {
      state.userSearchQuery = action.payload;
      // A new search starts from page 1 and drops any drill-down.
      state.usersPage = 1;
      state.selectedUserId = null;
      state.selectedPostId = null;
    },
    setUsersPage(state, action: PayloadAction<number>) {
      state.usersPage = action.payload;
    },
    setUsersLimit(state, action: PayloadAction<number>) {
      state.usersLimit = action.payload;
      state.usersPage = 1;
    },
    selectUser(state, action: PayloadAction<number | null>) {
      state.selectedUserId = action.payload;
      // Changing the user invalidates the post selection.
      state.selectedPostId = null;
    },
    selectPost(state, action: PayloadAction<number | null>) {
      state.selectedPostId = action.payload;
    },

    resetFilters() {
      return INITIAL_FILTERS;
    },
  },
});

export const {
  setWeatherQuery,
  setStocksPage,
  setStocksLimit,
  setStocksQuery,
  setUserSearchQuery,
  setUsersPage,
  setUsersLimit,
  selectUser,
  selectPost,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
