import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./exceptions/root.exception";
import { InternalException } from "./exceptions/internal.exception";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/badRequest.exception";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestException(
            "Unprocessable Entity",
            ErrorCode.UNPROCESSABLE_ENTITY,
            error
          );
        } else {
          exception = new InternalException(
            "Something went wrong!",
            error,
            ErrorCode.INTERNAL_EXCEPTION
          );
        }
      }
      next(exception);
    }
  };
};
