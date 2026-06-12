INSERT INTO "folders" ("name", "parent_folder_id", "sort_order")
SELECT 'Journal', NULL, 0
WHERE NOT EXISTS (
	SELECT 1
	FROM "folders"
	WHERE "name" = 'Journal' AND "parent_folder_id" IS NULL
);
--> statement-breakpoint
UPDATE "entries"
SET "folder_id" = (
	SELECT "id"
	FROM "folders"
	WHERE "name" = 'Journal' AND "parent_folder_id" IS NULL
	ORDER BY "created_at" ASC
	LIMIT 1
)
WHERE "journal_date" IS NOT NULL AND "folder_id" IS NULL;
