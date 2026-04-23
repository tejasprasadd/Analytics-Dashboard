import { useAppSelector } from "@/store/hooks";

export function useCollabEvents() {
  return useAppSelector((s) => s.collab.events);
}

