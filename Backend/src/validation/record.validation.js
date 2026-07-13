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
    article_id: z.number({
      required_error: "Article is required",
    }),
    employee_id: z.number({
      required_error: "Employee is required",
    }),
    areMeNo: requiredString("ARE/ME number is required"),
    status: requiredString("Status is required"),
    issuedDate: requiredString("Issued date is required"),
    returnedDate: z.string().nullable().optional(),
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