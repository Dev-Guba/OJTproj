import { z } from "zod";

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email("Email must be valid"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const createAdminSchema = z.object({
  body: z.object({
    email: z.string().email("Email must be valid"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    SameDeptCode: z
      .string()
      .min(1, "Office is required"),
  }),
});