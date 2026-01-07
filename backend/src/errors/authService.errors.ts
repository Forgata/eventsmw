import { AppError } from "./AppError.js";

// domain errors for authentication service (safe to expose)

// UserAlreadyExistsError

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("USER_ALREADY_EXISTS", "A user with this email already exists.", 409);
  }
}

// WeakPasswordError

export class WeakPasswordError extends AppError {
  constructor() {
    super(
      "WEAK_PASSWORD",
      "The password does not meet security requirements",
      400
    );
  }
}

// TokenGenerationError
export class TokenGenerationError extends AppError {
  constructor() {
    super(
      "TOKEN_GENERATION_FAILED",
      "Failed to generate authentication token",
      500
    );
  }
}

// UserCreationError

export class UserCreationError extends AppError {
  constructor() {
    super("USER_CREATION_FAILED", "Error occurred while creating user", 500);
  }
}

// RefreshTokenPersistenceError

export class RefreshTokenPersistenceError extends AppError {
  constructor() {
    super(
      "REFRESH_TOKEN_PERSISTENCE_FAILED",
      "Error occurred while persisting token",
      500
    );
  }
}

// InvalidCredentialsError
export class InvalidCredentialsError extends AppError {
  constructor() {
    super("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }
}

// * UserInactiveError optional
export class UserInactiveError extends AppError {
  constructor() {
    super("USER_INACTIVE", "User account is inactive", 403);
  }
}

// InvalidRefreshTokenError
export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super(
      "INVALID_REFRESH_TOKEN",
      "The provided refresh token is invalid",
      401
    );
  }
}

// ExpiredRefreshTokenError
export class ExpiredRefreshTokenError extends AppError {
  constructor() {
    super(
      "EXPIRED_REFRESH_TOKEN",
      "The provided refresh token is expired",
      401
    );
  }
}
