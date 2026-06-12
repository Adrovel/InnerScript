CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"parent_folder_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "entry_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "folder_id" uuid;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "journal_date" date;--> statement-breakpoint
UPDATE "entries" SET "journal_date" = COALESCE("occurred_at", "created_at")::date WHERE "entry_type" = 'journal';--> statement-breakpoint
UPDATE "entries" SET "entry_type" = 'document' WHERE "entry_type" IN ('journal', 'note');--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "entry_type" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "public"."entry_type";--> statement-breakpoint
CREATE TYPE "public"."entry_type" AS ENUM('document', 'conversation');--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "entry_type" SET DATA TYPE "public"."entry_type" USING "entry_type"::"public"."entry_type";--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "entry_type" SET DEFAULT 'document'::"public"."entry_type";--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_folder_id_folders_id_fk" FOREIGN KEY ("parent_folder_id") REFERENCES "public"."folders"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "folders_parent_folder_id_idx" ON "folders" USING btree ("parent_folder_id");--> statement-breakpoint
CREATE INDEX "folders_sort_order_idx" ON "folders" USING btree ("sort_order");--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "entries_folder_id_idx" ON "entries" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "entries_journal_date_idx" ON "entries" USING btree ("journal_date");
