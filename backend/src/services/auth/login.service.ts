import { ENV } from "../../config/env/env.js";
import {
  InvalidCredentialsError,
  RefreshTokenPersistenceError,
  TokenGenerationError,
} from "../../errors/service/errors.js";
import RefreshToken from "../../models/RefreshToken/RefreshToken.js";
import User from "../../models/User/User.js";
import { argonHash, verifyArgonHash } from "../../utils/crypto/crypto.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth/auth.js";
import type { SafeUser } from "./types/base/index.js";
import type { LoginUserInput, LoginUserOutput } from "./types/login.types.js";

export async function loginUser(
  input: LoginUserInput
): Promise<LoginUserOutput> {
  // to be implemented

  const { email, password } = input;
  const normalisedEmail = email.trim().toLowerCase();

  let existingUser, isPasswordValid: boolean;

  // check if user exists

  try {
    existingUser = await User.findOne({ email: normalisedEmail });
  } catch (err) {
    throw new InvalidCredentialsError();
  }

  if (!existingUser) throw new InvalidCredentialsError();

  // verify password
  try {
    isPasswordValid = await verifyArgonHash(
      password,
      existingUser.passwordHash
    );
  } catch (err) {
    throw new InvalidCredentialsError();
  }

  if (!isPasswordValid) throw new InvalidCredentialsError();

  // inactive user check (optional)
  // // if (!existingUser.isActive) throw new UserInactiveError();

  // generate tokens
  let accessToken: string, refreshToken: string;
  try {
    accessToken = await generateAccessToken({
      userId: existingUser._id.toString(),
      roles: existingUser.roles,
    });

    refreshToken = await generateRefreshToken({
      userId: existingUser._id.toString(),
    });

    if (!refreshToken || !accessToken) {
      throw new Error("Failed to generate token");
    }
  } catch (err) {
    throw new TokenGenerationError();
  }

  // persist refresh token
  try {
    const tokenHash = await argonHash(refreshToken);
    await RefreshToken.create({
      tokenHash,
      userId: existingUser._id,
      expiresAt: new Date(Date.now() + ENV.REFRESH_TTL_MS), // 7 days
    });
  } catch (err) {
    throw new RefreshTokenPersistenceError();
  }

  // return safe user data and tokens
  const safeUser: SafeUser = {
    id: existingUser._id.toString(),
    name: existingUser.name,
    email: existingUser.email,
    phone: existingUser.phone,
    roles: existingUser.roles,
    interests: existingUser.interests,
  };

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
}
