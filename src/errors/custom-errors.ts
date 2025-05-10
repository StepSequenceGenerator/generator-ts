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

class UtilsError extends CustomError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, details);
    this.name = 'UtilsError';
  }
}

class MovementParserError extends CustomError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, details);
    this.name = 'MovementParserError';
  }
}

class CoordinatesError extends CustomError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, details);
    this.name = 'CoordinatesError';
  }
}

class VectorCursorError extends CustomError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, details);
    this.name = 'VectorCursorError';
  }
}

class SequenceTrackerError extends CustomError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, details);
    this.name = 'SequenceTrackerError';
  }
}

export {
  CustomError,
  MovementParserError,
  CoordinatesError,
  VectorCursorError,
  SequenceTrackerError,
  UtilsError,
};
