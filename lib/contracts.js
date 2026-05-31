import { z } from "zod";
import { ENTRY_TYPES, SOURCE_TYPES } from "../db/schema.js";

export const MANUAL_ENTRY_TYPES = ["journal", "note"];

export const idSchema = z.string().uuid();
export const entryTypeSchema = z.enum(ENTRY_TYPES);
export const manualEntryTypeSchema = z.enum(MANUAL_ENTRY_TYPES);
export const sourceTypeSchema = z.enum(SOURCE_TYPES);

const bodySchema = z
  .string()
  .refine((value) => value.trim().length > 0, "Body is required");

const titleSchema = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

const dateInputSchema = z.union([z.string().min(1), z.date()]).transform((value, ctx) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid date",
    });

    return z.NEVER;
  }

  return date;
});

const optionalNullableDateInputSchema = dateInputSchema.nullable().optional();

export const createManualEntryInputSchema = z
  .object({
    title: titleSchema,
    body: bodySchema,
    entry_type: manualEntryTypeSchema.default("journal"),
    occurred_at: optionalNullableDateInputSchema,
  })
  .strict();

export const updateEntryInputSchema = z
  .object({
    title: titleSchema,
    body: bodySchema.optional(),
    occurred_at: optionalNullableDateInputSchema,
  })
  .strict()
  .refine(
    (value) => Object.values(value).some((fieldValue) => fieldValue !== undefined),
    "At least one field is required",
  );

export const createSourceInputSchema = z
  .object({
    source_type: sourceTypeSchema,
    display_name: titleSchema,
    original_filename: titleSchema,
    metadata: z.record(z.string(), z.unknown()).default({}),
    imported_at: dateInputSchema.optional(),
  })
  .strict();

export const createSourceEntryInputSchema = z
  .object({
    title: titleSchema,
    body: bodySchema,
    entry_type: entryTypeSchema.default("journal"),
    occurred_at: optionalNullableDateInputSchema,
  })
  .strict();

export const createSourceWithEntriesInputSchema = z
  .object({
    source: createSourceInputSchema,
    entries: z.array(createSourceEntryInputSchema).min(1),
  })
  .strict();

export function formatValidationError(error) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
