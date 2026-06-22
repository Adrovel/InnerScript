ALTER TABLE "entries" ALTER COLUMN "entry_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "entry_type" SET DEFAULT 'note'::text;--> statement-breakpoint
UPDATE "entries" SET "entry_type" = 'note' WHERE "entry_type" = 'document';--> statement-breakpoint
DROP TYPE "public"."entry_type";--> statement-breakpoint
CREATE TYPE "public"."entry_type" AS ENUM('note', 'conversation');--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "entry_type" SET DEFAULT 'note'::"public"."entry_type";--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "entry_type" SET DATA TYPE "public"."entry_type" USING "entry_type"::"public"."entry_type";
