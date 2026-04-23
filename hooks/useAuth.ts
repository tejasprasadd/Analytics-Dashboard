import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export function useAuth() {
  const router = useRouter();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  function handleLogout() {
    dispatch(logout());
    qc.clear();
    router.push("/login");
  }

  return { ...auth, handleLogout };
}

