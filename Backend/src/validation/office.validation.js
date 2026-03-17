import { z } from "zod";

export const createOfficeSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(1, "Office code is required")
      .max(20, "Office code must be at most 20 characters"),

    name: z
      .string()
      .min(1, "Office name is required")
      .max(100, "Office name must be at most 100 characters"),

    status: z
      .string()
      .optional()
      .default("active"),
  }),
});

export const updateOfficeSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(1, "Office code is required")
      .max(20, "Office code must be at most 20 characters")
      .optional(),

    name: z
      .string()
      .min(1, "Office name is required")
      .max(100, "Office name must be at most 100 characters")
      .optional(),

    status: z
      .string()
      .optional(),
  }),
});