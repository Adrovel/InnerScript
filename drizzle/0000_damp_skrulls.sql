CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TYPE "public"."entry_type" AS ENUM('journal', 'note', 'conversation');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('voice', 'markdown', 'text_file', 'whatsapp_export');--> statement-breakpoint
CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"entry_type" "entry_type" DEFAULT 'journal' NOT NULL,
	"source_id" uuid,
	"occurred_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" "source_type" NOT NULL,
	"display_name" text,
	"original_filename" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "entries_entry_type_idx" ON "entries" USING btree ("entry_type");--> statement-breakpoint
CREATE INDEX "entries_source_id_idx" ON "entries" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "entries_occurred_at_idx" ON "entries" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "sources_source_type_idx" ON "sources" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "sources_imported_at_idx" ON "sources" USING btree ("imported_at");
