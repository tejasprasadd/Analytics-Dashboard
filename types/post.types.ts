/**
 * DummyJSON post types.
 *
 * Endpoints covered:
 * - GET /posts
 * - GET /posts/{id}
 * - GET /posts/search?q=...
 * - GET /users/{id}/posts
 */
export interface DummyJsonPostReactions {
  likes: number;
  dislikes: number;
}

export interface DummyJsonPost {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: DummyJsonPostReactions;
  views: number;
  userId: number;
}

export interface DummyJsonPostsResponse {
  posts: DummyJsonPost[];
  total: number;
  skip: number;
  limit: number;
}
