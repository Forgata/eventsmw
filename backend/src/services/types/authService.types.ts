// base type for the user object passed to the controller
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  phone: string | undefined;
  roles: ("user" | "admin")[];
  interests: string[] | undefined;
}

// base response for endpoints
interface UserOutput {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

// * input types for rigister, login, logout and refresh services in auth.service.ts
export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  interests?: string[] | undefined;
  phoneNumber?: string | undefined;
}
export interface LoginUserInput {
  email: string;
  password: string;
}
export interface RefreshSessionInput {
  refreshToken: string;
}
export interface LogoutSessionInput {
  refreshToken: string;
}

export interface RefreshSessionOutput extends UserOutput {}
export interface RegisterUserOutput extends UserOutput {}
export interface LoginUserOutput extends RegisterUserOutput {}
// logout returns void
