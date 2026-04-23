export const REQRES_ENDPOINTS = {
  login: "/login",
  register: "/register",
  user: (id: number) => `/users/${id}`,
} as const;

