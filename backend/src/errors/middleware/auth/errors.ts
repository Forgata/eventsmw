import { AppError } from "../../base/AppError.js";

export class UnauthorisedError extends AppError {
  constructor() {
    super("UNAUTHORISED_ACCESS", "Not access denied", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access Denied") {
    super("FORBIDDEN_ERROR", message, 403);
  }
}
