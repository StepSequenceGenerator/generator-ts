class CustomError extends Error {
  constructor(
    message: string,
    public readonly code?: unknown,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class MovementParserError extends CustomError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, details);
    this.name = 'MovementParserError';
  }
}

export { CustomError, MovementParserError };
