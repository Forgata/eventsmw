import {
  RefreshTokenPersistenceError,
  TokenGenerationError,
  UserAlreadyExistsError,
  UserCreationError,
  WeakPasswordError,
  InvalidCredentialsError,
  UserInactiveError,
  InvalidRefreshTokenError,
  ExpiredRefreshTokenError,
} from "../errors/authService.errors.js";
import RefreshToken from "../models/RefreshToken/RefreshToken.js";
import User from "../models/User/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/generateTokens.js";
import { argonHash, verifyArgonHash } from "../utils/argon2.js";
import { passwordCheck } from "../utils/passwordCheck.js";
import type {
  LoginUserInput,
  LoginUserOutput,
  LogoutSessionInput,
  RefreshSessionInput,
  RefreshSessionOutput,
  RegisterUserInput,
  RegisterUserOutput,
  SafeUser,
} from "./types/authService.types.js";
import type { IUser } from "../models/User/IUser.js";
import { success } from "zod";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS), // 7 days
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
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS), // 7 days
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
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS), // 7 days
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
