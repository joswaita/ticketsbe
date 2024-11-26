import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";

export const createEvent = async (req: Request, res: Response) => {
  const { eventName } = req.body;
  //create a validator for this request
  const product = await prisma.event.create({
    data: {
      eventName,
    },
  });
  res.json(product);
};
