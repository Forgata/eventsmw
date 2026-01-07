//! register service types
export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  interests?: string[] | undefined;
  phoneNumber?: string | undefined;
  // roles: string[];
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  phone: string | undefined;
  roles: ("user" | "admin")[];
  interests: string[] | undefined;
}

interface UserOutput {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUserOutput extends UserOutput {}

//! login service types

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput extends RegisterUserOutput {}

// ! refresh token session types

export interface RefreshSessionInput {
  refreshToken: string;
}

export interface RefreshSessionOutput extends UserOutput {}

//! logout service types

export interface LogoutSessionInput {
  refreshToken: string;
}
