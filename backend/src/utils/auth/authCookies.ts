import { type CookieOptions } from "express";
import { ENV } from "../../config/env/env.js";

const COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const refreshTokenCookieOption: CookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  path: "/auth/refresh",
  maxAge: COOKIE_TTL_MS,
  sameSite: "lax",
};
