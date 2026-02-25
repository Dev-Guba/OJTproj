import { z } from "zod";

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email("Email must be valid"),
    password: z.string().min(1, "Password is required"),
  }),
});