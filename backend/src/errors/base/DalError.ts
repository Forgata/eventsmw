import { AppError } from "./AppError.js";

export class DalError extends AppError {
  constructor(code: string, message: string, statusCode = 500) {
    super(code, message, statusCode);
  }
}
