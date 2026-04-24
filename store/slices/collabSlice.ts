import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CollabEvent {
  id: string;
  at: string; // ISO timestamp
  text: string;
}

export interface CollabState {
  events: CollabEvent[];
}

const initialState: CollabState = { events: [] };

const MAX_EVENTS = 20;

const collabSlice = createSlice({
  name: "collab",
  initialState,
  reducers: {
    //Adds a new collaboration event.
    addCollabEvent(state, action: PayloadAction<CollabEvent>) {
      state.events.unshift(action.payload);
      if (state.events.length > MAX_EVENTS) state.events.length = MAX_EVENTS;
    },
    //Clears the collaboration events.
    clearEvents() {
      return initialState;
    },
  },
});

export const { addCollabEvent, clearEvents } = collabSlice.actions;
export default collabSlice.reducer;

