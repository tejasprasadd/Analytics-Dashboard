import { useMutation } from "@tanstack/react-query";

import { login, getUserProfile } from "@/services/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { loginFailure, loginStart, loginSuccess } from "@/store/slices/authSlice";
import type { AppError } from "@/lib/errors/AppError";


//Mutation is used here because it is used to call the login service, and it is a side effect and the tanstack query library is used to handle the caching and the invalidation of the data.
export function useLoginMutation() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (vars: { email: string; password: string }) => {
      dispatch(loginStart());

      const res = await login({ email: vars.email, password: vars.password });
      const profile = await getUserProfile(2);// ReqRes is a mock api, so we are hard coding the user id to 2.

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

