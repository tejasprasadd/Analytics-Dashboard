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

