import { sql } from "drizzle-orm";
import {
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const ENTRY_TYPES = ["note", "conversation"];
export const SOURCE_TYPES = ["manual", "voice", "markdown", "text_file", "whatsapp_export"];

export const entryTypeEnum = pgEnum("entry_type", ENTRY_TYPES);
export const sourceTypeEnum = pgEnum("source_type", SOURCE_TYPES);

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    parentFolderId: uuid("parent_folder_id"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "folders_parent_folder_id_folders_id_fk",
      columns: [table.parentFolderId],
      foreignColumns: [table.id],
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
    index("folders_parent_folder_id_idx").on(table.parentFolderId),
    index("folders_sort_order_idx").on(table.sortOrder),
  ],
);

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
    entryType: entryTypeEnum("entry_type").notNull().default("note"),
    folderId: uuid("folder_id").references(() => folders.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
    journalDate: date("journal_date"),
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
    index("entries_folder_id_idx").on(table.folderId),
    index("entries_journal_date_idx").on(table.journalDate),
    index("entries_source_id_idx").on(table.sourceId),
    index("entries_occurred_at_idx").on(table.occurredAt),
  ],
);

export const chunks = pgTable(
  "chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entryId: uuid("entry_id")
      .notNull()
      .references(() => entries.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    chunkIndex: integer("chunk_index").notNull(),
    text: text("text").notNull(),
    tokenCount: integer("token_count").notNull().default(0),
    embedding: vector("embedding", { dimensions: 1536 }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("chunks_entry_id_idx").on(table.entryId),
    index("chunks_entry_chunk_idx").on(table.entryId, table.chunkIndex),
  ],
);

export const people = pgTable(
  "people",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    displayName: text("display_name").notNull(),
    aliases: jsonb("aliases").notNull().default(sql`'[]'::jsonb`),
    description: text("description"),
    relationshipType: text("relationship_type"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("people_display_name_idx").on(table.displayName),
  ],
);

export const personMentions = pgTable(
  "person_mentions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entryId: uuid("entry_id").references(() => entries.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    personId: uuid("person_id").references(() => people.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    mentionedText: text("mentioned_text").notNull(),
    sentenceText: text("sentence_text").notNull(),
    status: text("status").notNull().default("confirmed"),
    createdBy: text("created_by").notNull().default("manual"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("person_mentions_entry_id_idx").on(table.entryId),
    index("person_mentions_person_id_idx").on(table.personId),
    index("person_mentions_status_idx").on(table.status),
  ],
);

export const digests = pgTable(
  "digests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    digestType: text("digest_type").notNull(),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    body: text("body").notNull(),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("digests_digest_type_idx").on(table.digestType),
    index("digests_period_idx").on(table.periodStart, table.periodEnd),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_resource_idx").on(table.resourceType, table.resourceId),
  ],
);
