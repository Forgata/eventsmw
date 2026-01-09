import type { NextFunction, Request, Response } from "express";
import type {
  LoginBody,
  LogoutBody,
  RefreshTokenBody,
  RegisterBody,
} from "../../schemas/auth.schema.js";
import { refreshTokenCookieOption } from "../../utils/auth/auth.js";
import { loginUser } from "../../services/auth/login.service.js";
import { refreshSession } from "../../services/auth/refresh.service.js";
import { logoutSession } from "../../services/auth/logout.service.js";
import { registerUser } from "../../services/auth/register.service.js";

export async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await registerUser(req.body);

    // issuing cookie
    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOption);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await loginUser(req.body);
    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOption);
    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request<{}, {}, RefreshTokenBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await refreshSession(req.body);
    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOption);
    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request<{}, {}, LogoutBody>,
  res: Response,
  next: NextFunction
) {
  try {
    await logoutSession(req.body);
    res.clearCookie("refreshToken", { path: "/auth/refresh" });
    res.sendStatus(204).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
