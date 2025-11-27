# ADR 002 - Database Schema Design (Notes and Folders)

## Status
Accepted

## Context
We needed a flexible schema to support:
- Hierarchical folder structure (folders can contain folders)
- Notes that can belong to folders or be root-level
- Vector embeddings for RAG (Retrieval Augmented Generation)
- UUID-based primary keys for distributed systems
- Timestamps for sorting and organization

## Considered Alternatives

### 1. Flat Structure (No Folders)
- **Pros**: Simpler queries, no recursion needed
- **Cons**: No organization, poor UX for large note collections
- **Decision**: Not chosen - folders are essential for organization

### 2. Materialized Path Pattern
- **Pros**: Fast queries for subtree operations, single query for full path
- **Cons**: More complex updates, path string manipulation
- **Decision**: Not chosen - adjacency list is simpler for our use case

### 3. Closure Table Pattern
- **Pros**: Efficient ancestor/descendant queries
- **Cons**: More storage, complex maintenance
- **Decision**: Not chosen - overkill for our folder depth requirements

### 4. Adjacency List (Current)
- **Pros**: Simple, intuitive, easy to understand and maintain
- **Cons**: Recursive queries needed for tree building (but done in application layer)
- **Decision**: **Chosen** - best balance of simplicity and functionality

## Decision
We use an **Adjacency List** pattern with the following schema:

### Notes Table
- `id` (UUID, primary key): Unique identifier
- `title` (STRING, required): Note title
- `content` (TEXT, nullable): Note content (rich text HTML)
- `folder_id` (UUID, nullable, foreign key): Parent folder (null = root level)
- `embedding` (VECTOR, nullable): pgvector embedding for RAG
- `createdAt`, `updatedAt` (timestamps): Auto-managed by Sequelize

### Folders Table
- `id` (UUID, primary key): Unique identifier
- `name` (STRING, required, 1-255 chars): Folder name
- `parent_id` (UUID, nullable, self-referencing): Parent folder (null = root)
- `createdAt`, `updatedAt` (timestamps): Auto-managed by Sequelize

### Key Design Decisions
1. **UUIDs over integers**: Better for distributed systems, no sequential ID exposure
2. **Nullable foreign keys**: Allows root-level items (no parent)
3. **Self-referencing folders**: Enables nested folder structure
4. **Vector embeddings**: Stored in notes table for RAG similarity search
5. **Timestamps**: Used for sorting (newest first)

## Consequences

### Positive
- ✅ Simple and intuitive schema
- ✅ Easy to query direct children
- ✅ Supports unlimited nesting depth
- ✅ UUIDs prevent ID enumeration attacks
- ✅ Embeddings stored with content for efficient RAG queries

### Negative
- ⚠️ Tree building requires recursive logic in application (see `buildTree()` in `action.js`)
- ⚠️ No database-level constraint preventing circular references (handled in application)
- ⚠️ Cascade delete not implemented (orphaned notes possible if folder deleted)
- ⚠️ Embeddings not automatically generated (manual process via `temp_embedgen.js`)

### Future Considerations
1. **Cascade Delete**: Add `ON DELETE CASCADE` to prevent orphaned notes
2. **Circular Reference Prevention**: Add database trigger or application-level validation
3. **Embedding Auto-generation**: Trigger embedding generation on note create/update
4. **Indexes**: Add indexes on `folder_id`, `parent_id` for faster queries
5. **Full-text Search**: Consider PostgreSQL full-text search for title/content search

### Migration Notes
- Current: Schema created via Sequelize `sync()` (development only)
- Production: Need proper migration with:
  - pgvector extension creation
  - Table creation with proper constraints
  - Index creation for performance
  - Foreign key constraints with cascade options

