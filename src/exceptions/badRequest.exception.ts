import { ErrorCode, HttpException } from "./root.exception";

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors: any = null) {
    super(message, errorCode, 400, errors);
  }
}
