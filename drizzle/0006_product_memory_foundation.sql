CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"aliases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text,
	"relationship_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person_mentions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid,
	"person_id" uuid,
	"mentioned_text" text NOT NULL,
	"sentence_text" text NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"created_by" text DEFAULT 'manual' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "digests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"digest_type" text NOT NULL,
	"period_start" timestamp with time zone,
	"period_end" timestamp with time zone,
	"body" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "person_mentions" ADD CONSTRAINT "person_mentions_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "person_mentions" ADD CONSTRAINT "person_mentions_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "people_display_name_idx" ON "people" USING btree ("display_name");--> statement-breakpoint
CREATE INDEX "person_mentions_entry_id_idx" ON "person_mentions" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "person_mentions_person_id_idx" ON "person_mentions" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "person_mentions_status_idx" ON "person_mentions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "digests_digest_type_idx" ON "digests" USING btree ("digest_type");--> statement-breakpoint
CREATE INDEX "digests_period_idx" ON "digests" USING btree ("period_start","period_end");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource_type","resource_id");
