import { ZodError } from "zod";

export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      if (parsed.query) req.query = parsed.query;

      return next();
    } catch (err) {
      // ✅ Zod validation error
      if (err instanceof ZodError) {
        const errors = err.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      // ✅ Unexpected error
      console.error("VALIDATION_MIDDLEWARE_ERROR:", err);
      return res.status(400).json({
        message: "Validation failed",
        errors: [{ message: "Invalid request" }],
      });
    }
  };
}