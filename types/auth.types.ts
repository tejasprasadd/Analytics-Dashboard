export interface ReqResAuthRequest {
  email: string;
  password: string;
}

export interface ReqResLoginResponse {
  token: string;
}

export interface ReqResRegisterResponse {
  id: number;
  token: string;
}

export interface AuthSession {
  email: string;
  token: string;
}

/** Single user object returned inside ReqRes `GET /users/:id` envelope. */
export interface ReqResUserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

/** ReqRes `GET /users/:id` JSON body (before unwrapping `.data`). */
export interface ReqResGetUserResponse {
  data: ReqResUserData;
  support?: {
    url: string;
    text: string;
  };
}

