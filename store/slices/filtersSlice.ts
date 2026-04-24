import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { logout } from "@/store/slices/authSlice";

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
    //Sets the weather query.
    setWeatherQuery(state, action: PayloadAction<string>) {
      state.weatherQuery = action.payload;
    },
    //Sets the stocks page.
    setStocksPage(state, action: PayloadAction<number>) {
      state.stocksPage = action.payload;
    },
    //Sets the stocks limit.
    setStocksLimit(state, action: PayloadAction<number>) {
      state.stocksLimit = action.payload;
    },
    //Sets the stocks query.
    setStocksQuery(state, action: PayloadAction<string>) {
      state.stocksQuery = action.payload;
      state.stocksPage = 1;
    },

    //Sets the user search query.
    setUserSearchQuery(state, action: PayloadAction<string>) {
      state.userSearchQuery = action.payload;
      // A new search starts from page 1 and drops any drill-down.
      //Because the new search state might not contain the old user. So we need to reset the page to 1.
      state.usersPage = 1;
      state.selectedUserId = null;
      state.selectedPostId = null;
    },
    //Sets the users page.
    setUsersPage(state, action: PayloadAction<number>) {
      state.usersPage = action.payload;
    },
    //Sets the users limit.
    setUsersLimit(state, action: PayloadAction<number>) {
      state.usersLimit = action.payload;
      state.usersPage = 1;
    },
    //Selects the user.
    selectUser(state, action: PayloadAction<number | null>) {
      state.selectedUserId = action.payload;
      // Changing the user invalidates the post selection.
      state.selectedPostId = null;
    },
    //Selects the post.
    selectPost(state, action: PayloadAction<number | null>) {
      state.selectedPostId = action.payload;
    },

    //Resets the filters.
    resetFilters() {
      return INITIAL_FILTERS;
    },
  },
  //Resets the filters when the user logs out.
  extraReducers: (builder) => {
    builder.addCase(logout, () => INITIAL_FILTERS);
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
