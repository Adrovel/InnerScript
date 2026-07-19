import { z } from "zod";

export const idSchema = z.uuid();

const titleSchema = z
  .string()
  .trim()
  .max(180)
  .transform((value) => value || null)
  .nullable()
  .optional();

export const createNoteInputSchema = z.object({
  title: titleSchema,
  body: z.string().trim().min(1),
});

export const updateNoteInputSchema = z
  .object({
    title: titleSchema,
    body: z.string().trim().min(1).optional(),
  })
  .refine((value) => value.title !== undefined || value.body !== undefined, {
    message: "At least one note field is required",
  });
