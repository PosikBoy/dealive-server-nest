interface IUser {
  id: number;
  phoneNumber: string;
  name: string;
  email: string;
}

interface ITokens {
  refreshToken: string;
  accessToken: string;
}

interface IAuthUserResponse {
  user: IUser;
  tokens: ITokens;
}
