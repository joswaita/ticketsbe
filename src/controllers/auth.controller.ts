import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../secrets";
import { BadRequestException } from "../exceptions/badRequest.exception";
import { ErrorCode } from "../exceptions/root.exception";
import { UnprocessableEntity } from "../exceptions/validation.exception";
import { signupSchema } from "../schema/user.schema";
import { NotFoundException } from "../exceptions/notFound.exception";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  signupSchema.parse(req.body);
  const { firstName, secondName, lastName, phoneNumber, email, password } =
    req.body;
  let user;
  user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    new BadRequestException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXISTS
    );
  } else {
    const user = await prisma.user.create({
      data: {
        firstName,
        secondName,
        lastName,
        phoneNumber,
        email,
        password: hashSync(password, 12),
      },
    });
    res.status(201).json({ message: "Account created successfully", user });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user;
  user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      "Invalid password or e-mail",
      ErrorCode.INCORRECT_PASSWORD_OR_EMAIL
    );
  }
  const token = jwt.sign({ userId: user.userId }, jwtSecret as string, {
    expiresIn: "1d",
  });
  res.json({ user, token });
};
