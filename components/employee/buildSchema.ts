// src/features/enrollment/schema/buildSchema.ts
import { z } from "zod";
import { StepDef } from "./types";

export function buildZodSchema(steps: StepDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const step of steps) {
    for (const f of step.fields) {
      if (f.type === "checkbox") {
        shape[f.key] = f.required
          ?z
  .boolean()
  .refine((v) => v === true, { message: "Required" })
          : z.boolean().optional();
        continue;
      }

      if (f.type === "file") {
        shape[f.key] = f.required
          ? z.any().refine((v) => v instanceof File, "File is required")
          : z.any().optional();
        continue;
      }

      // everything else treated as string/number inputs
      if (f.type === "number") {
        shape[f.key] = f.required
          ? z.coerce.number().min(0, "Must be 0 or more")
          : z.coerce.number().optional();
        continue;
      }

      // default string
      shape[f.key] = f.required
        ? z.string().min(1, "Required")
        : z.string().optional();
    }
  }

  return z.object(shape);
}
