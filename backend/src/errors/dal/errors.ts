import { DalError } from "../base/DalError.js";

export class DuplicateKeyError extends DalError {
  constructor(message = "Duplicate key violation") {
    super("DAL_DUPLICATE_KEY", message, 409);
  }
}

export class DatabaseError extends DalError {
  constructor(message = "Database operation failed") {
    super("DAL_DATABASE_ERROR", message, 500);
  }
}
