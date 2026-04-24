import { useMutation } from "@tanstack/react-query";

import { getUserProfile, register } from "@/services/auth.service";
import type { AppError } from "@/lib/errors/AppError";
import { useAppDispatch } from "@/store/hooks";
import { loginFailure, loginStart, loginSuccess } from "@/store/slices/authSlice";

//Mutation is used here because it is used to call the register service, 
// and it is a side effect and the tanstack query library is used to handle the caching and the invalidation of the data.
export function useRegisterMutation() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: async (vars: { email: string; password: string }) => {
      dispatch(loginStart());

      const res = await register({ email: vars.email, password: vars.password });

      // ReqRes register returns { id, token } but doesn't create a real user profile.
      // Keep it deterministic by fetching an existing demo profile.
      const profile = await getUserProfile(2);// ReqRes is a mock api, so we are hard coding the user id to 2.

      dispatch(
        loginSuccess({
          id: res.id,
          email: vars.email,
          token: res.token,
          firstName: profile.first_name,
          lastName: profile.last_name,
          avatar: profile.avatar,
        }),
      );

      return { id: res.id, token: res.token };
    },
    onError: (err) => {
      const msg = (err as AppError | Error)?.message ?? "Signup failed";
      dispatch(loginFailure(msg));
    },
  });
}

