import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./types/index.js";
import { ForbiddenError } from "../../errors/middleware/auth/errors.js";

export function requireOrganiser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) return next(new ForbiddenError());

  if (req.user?.isOrganiser && !req.user.isAdmin)
    return next(new ForbiddenError("Organiser Access Required"));

  next();
}
