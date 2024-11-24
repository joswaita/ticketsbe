import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../secrets";
import { BadRequestException } from "../exceptions/badRequest.exception";
import { ErrorCode } from "../exceptions/root.exception";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, secondName, lastName, phoneNumber, email, password } =
    req.body;
  let user;
  user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    next(
      new BadRequestException(
        "User already exists",
        ErrorCode.USER_ALREADY_EXISTS
      )
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
    throw new Error("User does not exist");
  }
  if (!compareSync(password, user.password)) {
    throw new Error("Incorrect Email or Password");
  }
  const token = jwt.sign({ userId: user.userId }, jwtSecret as string, {
    expiresIn: "1d",
  });
  res.json({ user, token });
};
