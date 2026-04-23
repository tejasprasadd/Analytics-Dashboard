export const PERSIST_KEYS = {
  authToken: "dash:auth:token",
  authUser: "dash:auth:user",
  theme: "dash:theme",
  filters: "dash:filters",
  schemaVersion: "dash:schemaVersion",
} as const;

/**
 * Bump when the shape of any persisted slice changes.
 * v2: filters slice dropped OMDb fields (`movieQuery`, `selectedImdbId`) and
 *     added DummyJSON fields (`userSearchQuery`, `usersPage`, `usersLimit`,
 *     `selectedUserId`, `selectedPostId`).
 */
export const CURRENT_SCHEMA_VERSION = 2;

