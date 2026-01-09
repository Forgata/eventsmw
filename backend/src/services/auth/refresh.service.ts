import { ENV } from "../../config/env/env.js";
import {
  ExpiredRefreshTokenError,
  InvalidRefreshTokenError,
  RefreshTokenPersistenceError,
  TokenGenerationError,
} from "../../errors/service/errors.js";
import RefreshToken from "../../models/RefreshToken/RefreshToken.js";
import User from "../../models/User/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/auth/auth.js";
import { argonHash, verifyArgonHash } from "../../utils/crypto/crypto.js";
import type { SafeUser } from "./types/base/index.js";
import type {
  RefreshSessionInput,
  RefreshSessionOutput,
} from "./types/refresh.types.js";

export async function refreshSession(
  input: RefreshSessionInput
): Promise<RefreshSessionOutput> {
  const { refreshToken } = input;

  // verify signatures
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) throw new InvalidRefreshTokenError();

  const userId = payload.userId as string | undefined;
  if (!userId) throw new InvalidRefreshTokenError();

  // lookup refresh token in db
  const storedTokens = await RefreshToken.find({
    userId,
  });

  // re-use detection
  let matchedToken = null;
  for (const token of storedTokens) {
    const isMatch = await verifyArgonHash(refreshToken, token.tokenHash);
    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    await RefreshToken.deleteMany({ userId });
    throw new InvalidRefreshTokenError();
  }

  if (matchedToken.expiresAt < new Date()) {
    await matchedToken.deleteOne();
    throw new ExpiredRefreshTokenError();
  }

  const user = await User.findById(userId);
  if (!user) throw new InvalidRefreshTokenError();

  // //if (!user.isActive) throw new UserInactiveError();

  // token rotation
  try {
    await matchedToken.deleteOne();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }

  let accessToken: string, newRefreshToken: string;
  try {
    accessToken = await generateAccessToken({
      userId: user._id.toString(),
      roles: user.roles,
    });

    newRefreshToken = await generateRefreshToken({
      userId: user._id.toString(),
    });

    if (!newRefreshToken || !accessToken) {
      throw new Error("Failed to generate token");
    }
  } catch (err) {
    throw new TokenGenerationError();
  }

  // persisting
  try {
    const newTokenHash = await argonHash(newRefreshToken);
    await RefreshToken.create({
      tokenHash: newTokenHash,
      userId: user._id,
      expiresAt: new Date(Date.now() + ENV.REFRESH_TTL_MS), // 7 days
    });
  } catch (err) {
    throw new RefreshTokenPersistenceError();
  }

  const safeUser: SafeUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    roles: user.roles,
    interests: user.interests,
  };

  return {
    user: safeUser,
    accessToken,
    refreshToken: newRefreshToken,
  };
}
