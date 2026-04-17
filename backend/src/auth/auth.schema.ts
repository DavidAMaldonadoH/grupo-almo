export type JwtPayload = {
  sub: number;
  email: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthResponse = {
  access_token: string;
  user: AuthUser;
};
