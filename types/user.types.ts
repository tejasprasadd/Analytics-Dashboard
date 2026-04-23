/**
 * DummyJSON user types.
 *
 * Keep the interface focused on fields the UI actually renders or groups by.
 * The live endpoint returns many more fields (address, bank, crypto, etc.),
 * but we intentionally model a minimal subset — extra properties are preserved
 * at runtime and ignored at the type level.
 *
 * Endpoints covered:
 * - GET /users
 * - GET /users/{id}
 * - GET /users/search?q=...
 */
export interface DummyJsonUserCompany {
  name: string;
  department: string;
  title: string;
}

export interface DummyJsonUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string;
  age?: number;
  gender?: string;
  phone?: string;
  company?: DummyJsonUserCompany;
}

/** Shared pagination envelope used by list/search endpoints. */
export interface DummyJsonUsersResponse {
  users: DummyJsonUser[];
  total: number;
  skip: number;
  limit: number;
}
