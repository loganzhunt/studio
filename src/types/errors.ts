/**
 * Custom error interface for application errors
 * Provides type safety for common error properties in the app
 */
export interface AppError extends Error {
  code?: string;
  message: string;
  name: string;
  stack?: string;
  details?: Record<string, unknown>;
}

/**
 * Firebase Auth error codes that are commonly used in the app
 */
export enum FirebaseAuthErrorCode {
  EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
  WRONG_PASSWORD = "auth/wrong-password",
  USER_NOT_FOUND = "auth/user-not-found",
  TOO_MANY_REQUESTS = "auth/too-many-requests",
  WEAK_PASSWORD = "auth/weak-password",
  INVALID_EMAIL = "auth/invalid-email",
  OPERATION_NOT_ALLOWED = "auth/operation-not-allowed",
  USER_DISABLED = "auth/user-disabled",
  EXPIRED_ACTION_CODE = "auth/expired-action-code",
  INVALID_ACTION_CODE = "auth/invalid-action-code",
  POPUP_CLOSED_BY_USER = "auth/popup-closed-by-user",
  NETWORK_REQUEST_FAILED = "auth/network-request-failed",
}

/**
 * Type guard to check if an error is an AppError
 * @param error - The unknown error to check
 * @returns boolean indicating if the error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as AppError).message === "string"
  );
}

/**
 * Type guard to check if an error is a Firebase Auth error
 * @param error - The unknown error to check
 * @returns boolean indicating if the error is a Firebase Auth error
 */
export function isFirebaseAuthError(error: unknown): error is AppError {
  return (
    isAppError(error) &&
    "code" in error &&
    typeof (error as AppError).code === "string" &&
    (error as AppError).code?.startsWith("auth/")
  );
}

/**
 * Helper function to get a user-friendly error message from an unknown error
 * @param error - The unknown error
 * @param defaultMessage - Default message to return if error can't be parsed
 * @returns A user-friendly error message
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage = "An unexpected error occurred"
): string {
  if (isAppError(error)) {
    return error.message || defaultMessage;
  }

  if (typeof error === "string") {
    return error;
  }

  return defaultMessage;
}
