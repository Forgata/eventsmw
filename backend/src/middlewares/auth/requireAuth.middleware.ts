import type { NextFunction, Request, Response } from "express";
import { UnauthorisedError } from "../../errors/middleware/auth/errors.js";
import { verifyAccessToken } from "../../utils/auth/generateTokens.js";
import type { AuthRequest, UserPayload } from "./types/index.js";

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authorisationHeader = req.headers["authorization"];
  if (!authorisationHeader) return next(new UnauthorisedError());
  if (!authorisationHeader?.startsWith("Bearer "))
    return next(new UnauthorisedError());

  const token = authorisationHeader.replace(/^Bearer\s+/i, "");
  if (!token) return next(new UnauthorisedError());

  let payload: unknown;
  try {
    payload = await verifyAccessToken(token);
  } catch (err) {
    return next(new UnauthorisedError());
  }

  const { id, roles } = payload as Partial<UserPayload>;
  if (!id || !Array.isArray(roles)) return next(new UnauthorisedError());
  const isOrganiser: boolean = roles.some((role) => role === "organiser");
  const isAdmin: boolean = roles.some((role) => role === "admin");
  req.user = { id, roles, isOrganiser, isAdmin };
  next();
}
