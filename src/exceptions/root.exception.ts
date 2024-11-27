/**
 * message
 * status code
 * error codes
 */
export class HttpException extends Error {
  statusCode: number;
  message: string;
  errorCode: any;
  errors: ErrorCode;
  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD_OR_EMAIL = 1003,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXCEPTION = 3001,
  UNAUTHORIZED_EXCEPTION = 4001,
  EVENT_NOT_FOUND = 5001,
  CANNOT_CANCEL_EVENT = 5002,
  CONTACT_ADMIN = 6001,
  CONTACT_ADMIN_TICKETS_EXIST = 6002,
}
