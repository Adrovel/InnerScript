import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const ENTRY_TYPES = ["journal", "note", "conversation"];
export const SOURCE_TYPES = ["manual", "voice", "markdown", "text_file", "whatsapp_export"];

export const entryTypeEnum = pgEnum("entry_type", ENTRY_TYPES);
export const sourceTypeEnum = pgEnum("source_type", SOURCE_TYPES);

export const sources = pgTable(
  "sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceType: sourceTypeEnum("source_type").notNull(),
    displayName: text("display_name"),
    originalFilename: text("original_filename"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    importedAt: timestamp("imported_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("sources_source_type_idx").on(table.sourceType),
    index("sources_imported_at_idx").on(table.importedAt),
  ],
);

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title"),
    body: text("body").notNull(),
    entryType: entryTypeEnum("entry_type").notNull().default("journal"),
    sourceId: uuid("source_id").references(() => sources.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("entries_entry_type_idx").on(table.entryType),
    index("entries_source_id_idx").on(table.sourceId),
    index("entries_occurred_at_idx").on(table.occurredAt),
  ],
);
