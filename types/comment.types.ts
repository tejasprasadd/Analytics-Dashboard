/**
 * DummyJSON comment types.
 *
 * Endpoints covered:
 * - GET /comments
 * - GET /comments/{id}
 * - GET /comments/post/{postId}
 * - GET /posts/{postId}/comments
 */
export interface DummyJsonCommentUser {
  id: number;
  username: string;
  fullName: string;
}

export interface DummyJsonComment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: DummyJsonCommentUser;
}

export interface DummyJsonCommentsResponse {
  comments: DummyJsonComment[];
  total: number;
  skip: number;
  limit: number;
}
