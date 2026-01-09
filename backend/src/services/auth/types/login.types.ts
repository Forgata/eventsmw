// return types for the login service
import type { UserOutput } from "./base/index.js";

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput extends UserOutput {}
