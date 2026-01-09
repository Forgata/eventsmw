import {
  ExpiredRefreshTokenError,
  InvalidRefreshTokenError,
  RefreshTokenPersistenceError,
} from "../../errors/service/errors.js";
import RefreshToken from "../../models/RefreshToken/RefreshToken.js";
import { verifyRefreshToken } from "../../utils/auth/auth.js";
import { verifyArgonHash } from "../../utils/crypto/crypto.js";
import type { LogoutSessionInput } from "./types/logout.types.js";

export async function logoutSession(input: LogoutSessionInput) {
  const { refreshToken } = input;

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) throw new InvalidRefreshTokenError();

  const userId = payload.userId as string | undefined;
  if (!userId) throw new InvalidRefreshTokenError();

  const storedTokens = await RefreshToken.find({ userId });

  let matchedToken = null;
  for (const token of storedTokens) {
    const isMatch = await verifyArgonHash(refreshToken, token.tokenHash);
    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) throw new InvalidRefreshTokenError();

  if (matchedToken.expiresAt < new Date()) {
    await matchedToken.deleteOne();
    throw new ExpiredRefreshTokenError();
  }

  try {
    await matchedToken.deleteOne();
  } catch (error) {
    throw new RefreshTokenPersistenceError();
  }
}
