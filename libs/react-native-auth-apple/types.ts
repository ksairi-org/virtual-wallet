import type { AppleLoginParameters } from "./hooks/useAppleLoginWithPersistence";

type AppleSignInErrorType =
  | "CONFIGURATION_ERROR"
  | "SIGN_IN_FAILED"
  | "SIGN_IN_CANCELLED"
  | "INVALID_RESPONSE"
  | "NOT_HANDLED"
  | "UNKNOWN";

class AppleSignInError extends Error {
  /**
   * Create a new AppleSignInError.
   * @param code - The error code representing the type of Apple sign-in error.
   * @param message - A human-readable error message.
   * @param originalError - The original error, if applicable.
   */
  constructor(
    public code: AppleSignInErrorType,
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}

type AppleSignInResponse = { idToken: string; nonce: string };

type HandleByPlatformResponse = AppleLoginParameters;

export type {
  AppleSignInResponse,
  AppleSignInErrorType,
  HandleByPlatformResponse,
};

export { AppleSignInError };
