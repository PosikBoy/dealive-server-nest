export interface IClient {
  id: number;
  phoneNumber: string;
  name: string;
  email: string;
  role: string;
  isEmailConfirmed: boolean;
  isNumberConfirmed: boolean;
}

export interface ITokens {
  refreshToken: string;
  accessToken: string;
}

export interface IAuthClientResponse {
  client: IClient;
  tokens: ITokens;
}
