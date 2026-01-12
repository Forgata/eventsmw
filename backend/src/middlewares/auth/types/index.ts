import type { Request } from "express";

export interface UserPayload {
  id: string;
  roles: string[];
  isOrganiser: boolean;
  isAdmin: boolean;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
