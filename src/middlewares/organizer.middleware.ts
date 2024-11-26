import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { ErrorCode } from "../exceptions/root.exception";

const organizerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.roles.find((role) => role === "Organizer")) {
    next();
  } else {
    next(
      new UnauthorizedException(
        "Unauthorized",
        ErrorCode.UNAUTHORIZED_EXCEPTION
      )
    );
  }
};

export default organizerMiddleware;
