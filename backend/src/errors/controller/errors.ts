import { AppError } from "../base/AppError.js";

export class BadRequestError extends AppError {
  constructor(message: string = "Invalid input data") {
    super("BAD_REQUEST", message, 400);
  }
}
