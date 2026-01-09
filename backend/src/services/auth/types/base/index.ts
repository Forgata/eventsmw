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
export interface UserOutput {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}
