import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import type { AppDispatch, RootState } from "@/store";

//Returns the store's displatch function and using it make changes to the state in type-safe way. 
//This is a type-safe way to dispatch actions to the store.
export const useAppDispatch: () => AppDispatch = useDispatch;
//Returns the store's selector function and using it make changes to the state in type-safe way. 
//TypeScript can autocomplete auth/theme/filters/collab correctly and catch typos/wrong fields.
//This is a type-safe way to select the state from the store.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

