import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthSession } from "@/types/auth.types";

export interface AuthState {
  user: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //Starts the login process, showing the loading state.
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },

    //Login is successful, setting the user and the authenticated state.
    loginSuccess(state, action: PayloadAction<AuthSession>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    //Login is failed, setting the error and the loading state.
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    //Logout is successful, resetting the state to the initial state.
    logout() {
      return initialState;
    },
    //Rehydrates the state from the localStorage.
    rehydrate(state, action: PayloadAction<AuthSession | null>) {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload?.token);
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, rehydrate } =
  authSlice.actions;

export default authSlice.reducer;

