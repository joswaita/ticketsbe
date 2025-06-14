import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/root.exception";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    statusCode: error.statusCode,
    errors: error.errors,
  });
};
