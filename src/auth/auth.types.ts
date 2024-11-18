interface IClient {
  id: number;
  phoneNumber: string;
  name: string;
  email: string;
}

interface ITokens {
  refreshToken: string;
  accessToken: string;
}

interface IAuthClientResponse {
  client: IClient;
  tokens: ITokens;
}
