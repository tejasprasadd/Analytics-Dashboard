import { useMutation } from "@tanstack/react-query";

import { login, getUserProfile } from "@/services/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { loginFailure, loginStart, loginSuccess } from "@/store/slices/authSlice";
import type { AppError } from "@/lib/errors/AppError";

export function useLoginMutation() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (vars: { email: string; password: string }) => {
      dispatch(loginStart());

      const res = await login({ email: vars.email, password: vars.password });
      const profile = await getUserProfile(2);

      dispatch(
        loginSuccess({
          id: profile.id,
          email: vars.email,
          token: res.token,
          firstName: profile.first_name,
          lastName: profile.last_name,
          avatar: profile.avatar,
        }),
      );

      return { token: res.token };
    },
    onError: (err) => {
      const msg = (err as AppError | Error)?.message ?? "Login failed";
      dispatch(loginFailure(msg));
    },
  });
}

