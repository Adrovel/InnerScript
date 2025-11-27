# ADR 001 - Use Sequelize ORM for Database Operations

## Status
Accepted

## Context
We needed a robust ORM solution for PostgreSQL that supports:
- Native JavaScript/TypeScript support (no need for TypeScript compilation)
- Migration support for schema versioning
- Transaction support for data integrity
- Association management for relationships (folders ↔ notes, folders ↔ folders)
- Mature, well-maintained package with extensive documentation

## Considered Alternatives

### 1. Prisma
- **Pros**: Type-safe, excellent developer experience, auto-generated types
- **Cons**: Requires TypeScript or code generation, learning curve, heavier abstraction
- **Decision**: Not chosen due to TypeScript requirement and complexity for this project

### 2. Raw SQL with `pg` driver
- **Pros**: Full control, no abstraction overhead, direct SQL queries
- **Cons**: Manual query building, no built-in migrations, error-prone, more boilerplate
- **Decision**: Not chosen due to maintenance burden and lack of migration support

### 3. TypeORM
- **Pros**: Decorator-based, supports both SQL and NoSQL
- **Cons**: TypeScript-first, complex setup, performance overhead
- **Decision**: Not chosen due to TypeScript requirement

### 4. Knex.js
- **Pros**: Query builder, flexible, good migration support
- **Cons**: No built-in model definitions, more manual work for associations
- **Decision**: Not chosen due to lack of model abstraction

## Decision
We chose **Sequelize 6** because:
1. **Native JavaScript support**: Works out of the box with Next.js without TypeScript compilation
2. **Mature and stable**: 10+ years of development, widely used in production
3. **Migration support**: Built-in migration system (though currently using `sync()` in dev)
4. **Association management**: Easy definition of relationships (belongsTo, hasMany)
5. **Transaction support**: Built-in transaction API for complex operations
6. **Active Record pattern**: Familiar model-based API
7. **PostgreSQL-specific features**: Supports UUID, JSON, and can be extended for pgvector

## Consequences

### Positive
- ✅ Rapid development with model definitions
- ✅ Automatic relationship handling
- ✅ Built-in validation and constraints
- ✅ Easy to add migrations later
- ✅ Good documentation and community support

### Negative
- ⚠️ Currently using `sync()` in development (not production-ready)
- ⚠️ Need to add proper migrations for production (see ADR-002)
- ⚠️ Some performance overhead compared to raw SQL
- ⚠️ Learning curve for team members unfamiliar with Sequelize

### Migration Path
- Current: Using `sync({ alter: true })` commented out in `lib/db/index.js`
- Future: Implement proper migration system before production deployment
- Action Items:
  1. Create initial migration for notes and folders tables
  2. Add migration for pgvector extension
  3. Remove `sync()` calls from production code
  4. Set up migration runner in CI/CD

