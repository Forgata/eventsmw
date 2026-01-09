import { ENV } from "../../config/env/env.js";
import {
  UserAlreadyExistsError,
  WeakPasswordError,
  UserCreationError,
  TokenGenerationError,
  RefreshTokenPersistenceError,
} from "../../errors/service/errors.js";
import RefreshToken from "../../models/RefreshToken/RefreshToken.js";
import User from "../../models/User/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  passwordCheck,
} from "../../utils/auth/auth.js";
import { argonHash } from "../../utils/crypto/crypto.js";
import type { SafeUser } from "./types/base/index.js";
import type {
  RegisterUserInput,
  RegisterUserOutput,
} from "./types/register.types.js";

export async function registerUser(
  input: RegisterUserInput
): Promise<RegisterUserOutput> {
  // extraction of user details

  const { name, email, password, phoneNumber, interests } = input;
  const normalisedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalisedEmail });

  if (existingUser) {
    throw new UserAlreadyExistsError();
  }

  const passwordStrength = passwordCheck(password);
  if (passwordStrength === "weak") throw new WeakPasswordError();

  const passwordHash = await argonHash(password);
  const userData = {
    name,
    email: normalisedEmail,
    passwordHash,
    phone: phoneNumber || "",
    interests: interests || [],
    roles: ["user"] as ("user" | "admin")[],
  };

  let newUser;
  try {
    newUser = await User.create(userData);
  } catch (err) {
    throw new UserCreationError();
  }

  let accessToken: string, refreshToken: string;

  try {
    accessToken = await generateAccessToken({
      userId: newUser._id.toString(),
      roles: newUser.roles,
    });
    refreshToken = await generateRefreshToken({
      userId: newUser._id.toString(),
    });

    if (!refreshToken || !accessToken)
      throw new Error("Failed to generate token");
  } catch (err) {
    throw new TokenGenerationError();
  }
  //   persisting refresh token to DB
  try {
    const tokenHash = await argonHash(refreshToken);
    await RefreshToken.create({
      tokenHash,
      userId: newUser._id,
      expiresAt: new Date(Date.now() + ENV.REFRESH_TTL_MS), // 7 days
    });
  } catch (err) {
    throw new RefreshTokenPersistenceError();
  }

  const safeUser: SafeUser = {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    roles: newUser.roles,
    interests: newUser.interests,
  };

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
}
