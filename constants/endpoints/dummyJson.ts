/**
 * DummyJSON API paths, grouped by resource.
 *
 * Docs:
 * - https://dummyjson.com/docs/users
 * - https://dummyjson.com/docs/posts
 * - https://dummyjson.com/docs/comments
 *
 * All paths are appended to `env.dummyJsonBaseUrl` (https://dummyjson.com).
 */
export const DUMMYJSON_ENDPOINTS = {
  users: {
    list: "/users",
    search: "/users/search",
    byId: (id: number | string) => `/users/${id}`,
    postsByUser: (id: number | string) => `/users/${id}/posts`,
  },
  posts: {
    list: "/posts",
    search: "/posts/search",
    byId: (id: number | string) => `/posts/${id}`,
    commentsByPost: (id: number | string) => `/posts/${id}/comments`,
  },
  comments: {
    list: "/comments",
    byId: (id: number | string) => `/comments/${id}`,
    byPost: (postId: number | string) => `/comments/post/${postId}`,
  },
} as const;
