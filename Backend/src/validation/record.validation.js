import { z } from "zod";

const nullableNumber = z.union([z.number(), z.null()]).optional();

// ✅ helper: if missing/undefined/null -> "", then min() will show your message
const requiredString = (msg) =>
  z.preprocess(
    (v) => (v === undefined || v === null ? "" : v),
    z.string().min(1, msg)
  );

export const recordCreateSchema = z.object({
  body: z.object({
    article: requiredString("Article is required"),
    description: z.string().optional().default(""),

    propNumber: requiredString("Prop number is required"),
    dateAcquired: requiredString("Date acquired is required"),

    unit: z.string().optional().default(""),
    unitValue: nullableNumber,
    balQty: nullableNumber,
    balValue: nullableNumber,

    accountableOfficer: requiredString("Accountable office is required"),
    areMeNo: z.string().optional().default(""),
    office: requiredString("Office is required"),

    // Optional legacy keys (won't fail if present)
    value: nullableNumber,
    quantity: nullableNumber,
  }),
});

export const recordUpdateSchema = z.object({
  params: z.object({
    id: requiredString("ID is required"),
  }),
  body: recordCreateSchema.shape.body.partial(),
});

export const recordIdParamSchema = z.object({
  params: z.object({
    id: requiredString("ID is required"),
  }),
});