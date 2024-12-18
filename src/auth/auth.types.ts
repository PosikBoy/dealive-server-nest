interface IClient {
  id: number;
  phoneNumber: string;
  name: string;
  email: string;
  role: string;
  isEmailConfirmed: boolean;
  isNumberConfirmed: boolean;
}

interface ITokens {
  refreshToken: string;
  accessToken: string;
}

interface IAuthClientResponse {
  client: IClient;
  tokens: ITokens;
}
