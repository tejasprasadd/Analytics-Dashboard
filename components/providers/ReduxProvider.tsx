"use client";

import { Provider } from "react-redux";

import { store } from "@/store";

//This plugs the redux store into the application.
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

