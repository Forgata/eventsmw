import { AppError } from "../base/AppError.js";

export class UnauthorisedError extends AppError {
  constructor() {
    super("UNAUTHORISED_ACCESS", "Not access denied", 401);
  }
}
