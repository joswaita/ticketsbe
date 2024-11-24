import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string(),
  secondName: z.string().nullable(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  password: z.string().min(6),
});
