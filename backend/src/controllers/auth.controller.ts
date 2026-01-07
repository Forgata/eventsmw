import type { NextFunction, Request, Response } from "express";
import {
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
} from "../services/auth.service.js";
import type {
  LoginBody,
  LogoutBody,
  RefreshTokenBody,
  RegisterBody,
} from "../schemas/auth.schema.js";

export async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      data: result,
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
    res.status(200).json({
      success: true,
      data: result,
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
    res.status(200).json({
      success: true,
      data: result,
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
    const result = await logoutSession(req.body);
    res.status(204).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

// todo do this below
