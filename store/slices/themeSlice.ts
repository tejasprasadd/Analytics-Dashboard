import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = { mode: "light" };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    //Sets the theme mode.
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    //Toggles the theme mode.
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

