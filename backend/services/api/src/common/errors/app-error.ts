export class AppError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly metadata?: Record<string, unknown>
  ) {
    super(message);
  }
}
