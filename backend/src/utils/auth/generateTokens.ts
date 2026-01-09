import { SignJWT, errors, jwtVerify, type JWTPayload } from "jose";
import { ENV } from "../../config/env/env.js";
import { InvalidRefreshTokenError } from "../../errors/service/errors.js";

// ! checking if env variables exist
const jwtAccessKey = ENV.JWT_ACCESS_SECRET;
if (!jwtAccessKey) {
  throw new Error("Unresolved environment variables: JWT_ACCESS_SECRET");
}

const jwtResfreshKey = ENV.JWT_REFRESH_SECRET;
if (!jwtResfreshKey) {
  throw new Error("Unresolved environment variables: JWT_REFRESH_SECRET");
}

// ! access token logic
interface AccessTokenInput extends JWTPayload {
  userId: string;
  roles: string[];
}

export const generateAccessToken = async (payload: AccessTokenInput) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(jwtAccessKey);
};

//! Refresh token logic

interface RefreshTokenInput extends JWTPayload {
  userId: string;
}

export const generateRefreshToken = async (payload: RefreshTokenInput) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtResfreshKey);
};

// verifying tokens

export const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, jwtResfreshKey);
    return payload;
  } catch (err: unknown) {
    if (err instanceof errors.JWTExpired)
      console.error("Token expired at: " + err.claim);

    if (err instanceof errors.JWSSignatureVerificationFailed)
      console.error("INVALID_SIGNATURE");
    return null;
  }
};

export const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, jwtAccessKey);
    return payload;
  } catch {
    throw new InvalidRefreshTokenError();
  }
};
