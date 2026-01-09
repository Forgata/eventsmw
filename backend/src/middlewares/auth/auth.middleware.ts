import type { NextFunction, Request, Response } from "express";
import { UnauthorisedError } from "../../errors/middleware/errors.js";
import { verifyAccessToken } from "../../utils/auth/generateTokens.js";

interface UserPayload {
  userId: string;
  roles: string[];
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

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

  const { userId, roles } = payload as Partial<UserPayload>;
  if (!userId || !Array.isArray(roles)) return next(new UnauthorisedError());
  req.user = { userId, roles };
  next();
}

// optional auth middleware for non-auth heavy routes
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authorisationHeader = req.headers["authorization"];
  if (!authorisationHeader) return next();
  if (!authorisationHeader.startsWith("Bearer ")) return next();

  const token = authorisationHeader.replace(/^Bearer\s+/i, "");
  if (!token) return next();

  let payload: unknown;
  try {
    payload = await verifyAccessToken(token);
  } catch (err) {
    return next();
  }

  const { userId, roles } = payload as Partial<UserPayload>;
  if (!userId || !Array.isArray(roles)) return next();
  req.user = { userId, roles };
  next();
}
