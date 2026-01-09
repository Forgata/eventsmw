import type { UserOutput } from "./base/index.js";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  interests?: string[] | undefined;
  phoneNumber?: string | undefined;
}

export interface RegisterUserOutput extends UserOutput {}
