import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { ErrorCode } from "../exceptions/root.exception";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../secrets";
import { prisma } from "../utils/prismaClient";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //extract the token from the header
  const token = req.headers.authorization;
  //if token is not present, throw an error of unauthorized
  if (!token) {
    next(
      new UnauthorizedException(
        "Unauthorized",
        ErrorCode.UNAUTHORIZED_EXCEPTION
      )
    );
  }
  //if token is present, verify the token and verify payload
  try {
    const payload = jwt.verify(token as string, jwtSecret as string) as any;

    //Get user from the payload
    const user = await prisma.user.findFirst({
      where: { userId: payload.userId },
    });
    if (!user) {
      next(
        new UnauthorizedException(
          "Unauthorized",
          ErrorCode.UNAUTHORIZED_EXCEPTION
        )
      );
    }
    //attach user to the request object
    req.user = user as any;
    next();
  } catch (error) {
    next(
      new UnauthorizedException(
        "Unauthorized",
        ErrorCode.UNAUTHORIZED_EXCEPTION
      )
    );
  }
};
