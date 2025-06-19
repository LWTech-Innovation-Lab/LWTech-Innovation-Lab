# ADR-003: Database/ORM Selection

## Status

Proposed

## Context

The Innovation Lab Print Management System requires a robust data persistence layer to manage:

- User accounts and authentication
- Print job queue with complex priority rules
- File metadata and storage references
- Device status and capabilities
- Job history and analytics
- Real-time status updates

The system needs to support concurrent access from multiple services (API, queue management, Discord bot) whilst maintaining data consistency and providing type safety between the database and TypeScript API.

## Decision Drivers

1. **Type Safety**: Strong TypeScript integration for compile-time error detection
2. **Schema Management**: Easy database migrations and version control
3. **Performance**: Efficient queries for queue operations and status updates
4. **Developer Experience**: Good tooling, debugging, and introspection capabilities
5. **Multi-Service Access**: Both TypeScript (API) and Python (queue/bot) services need database access
6. **Complex Queries**: Priority-based queue sorting, job history analytics
7. **Real-time Features**: Support for database-level notifications or efficient polling
8. **Team Scalability**: Approachable for developers with varying database experience

## Database Choice (Already Decided)

**PostgreSQL** - confirmed as the optimal choice for ACID compliance, JSON support, and robust feature set.

## ORM/Query Builder Options

### Option A: Prisma

**Architecture:**

- Schema-first approach with Prisma schema file
- Generated TypeScript client with full type safety
- Built-in migration system
- Prisma Studio for database introspection

**Pros:**

- **Excellent TypeScript Integration**: Auto-generated types match database schema exactly
- **Developer Experience**: Prisma Studio provides excellent database browsing
- **Migration System**: Version-controlled schema changes with automatic migration generation
- **Type Safety**: Compile-time errors for invalid queries
- **Modern Patterns**: Async/await throughout, no callback hell
- **Documentation**: Excellent docs and learning resources
- **Introspection**: Can generate schema from existing database

**Cons:**

- **Python Integration**: Limited; would need separate Python ORM for queue service
- **Query Flexibility**: Less control over raw SQL compared to query builders
- **Bundle Size**: Larger runtime compared to lighter alternatives
- **Vendor Lock-in**: Prisma-specific patterns throughout codebase

### Option B: Drizzle ORM

**Architecture:**

- TypeScript-first ORM with SQL-like syntax
- Lightweight runtime with excellent performance
- Schema defined in TypeScript files

**Pros:**

- **Performance**: Minimal overhead, very fast queries
- **SQL-like Syntax**: Easy transition for developers familiar with SQL
- **TypeScript Native**: Built specifically for TypeScript
- **Flexibility**: More control over queries than Prisma
- **Smaller Bundle**: Lightweight compared to Prisma

**Cons:**

- **Newer Ecosystem**: Less mature than Prisma, fewer resources
- **Python Integration**: Still requires separate Python ORM
- **Tooling**: Less sophisticated than Prisma Studio
- **Community**: Smaller community and fewer examples

### Option C: TypeORM

**Architecture:**

- Entity-based ORM with decorators
- Active Record or Data Mapper patterns
- Repository pattern support

**Pros:**

- **Mature**: Long-established with large community
- **Flexible**: Supports both Active Record and Data Mapper patterns
- **Raw SQL Support**: Easy to drop down to raw SQL when needed
- **Migration System**: Built-in migration support

**Cons:**

- **Decorator Heavy**: Requires experimental TypeScript features
- **Complex Setup**: More configuration than modern alternatives
- **Performance**: Heavier than newer ORMs
- **Python Integration**: Still requires separate Python solution

### Option D: Kysely (Query Builder)

**Architecture:**

- SQL query builder with strong TypeScript support
- Database-first approach with type generation
- No ORM patterns, pure SQL building

**Pros:**

- **Type Safety**: Excellent TypeScript integration without ORM overhead
- **Performance**: Minimal abstraction over SQL
- **Flexibility**: Full control over SQL queries
- **Learning**: Teaches SQL properly rather than hiding it

**Cons:**

- **More Verbose**: Requires more boilerplate than ORMs
- **Python Integration**: Need separate Python solution
- **Manual Work**: No automatic migrations or schema management

### Option E: Mixed Approach (Prisma + SQLAlchemy)

**Architecture:**

- Prisma for TypeScript API service
- SQLAlchemy for Python queue management and Discord bot
- Shared database schema maintained through migrations

**Pros:**

- **Best of Both Worlds**: Each service uses optimal tools
- **Type Safety**: Prisma provides excellent TypeScript integration
- **Python Ecosystem**: SQLAlchemy is mature and feature-rich
- **Language Appropriate**: Each service uses idiomatic patterns

**Cons:**

- **Schema Synchronization**: Need to keep two schema definitions in sync
- **Complexity**: Two different ORM patterns to maintain
- **Learning Curve**: Team needs to understand both systems

## Decision

**Option E: Mixed Approach (Prisma + SQLAlchemy)**

### Rationale

1. **Language-Appropriate Tools**: Each service uses the best available ORM for its language ecosystem
2. **Type Safety Where It Matters**: Prisma provides excellent TypeScript integration for the API
3. **Python Ecosystem**: SQLAlchemy is the gold standard for Python database access
4. **Performance**: Both ORMs are optimized for their respective runtimes
5. **Team Efficiency**: Developers can focus on one ORM per service rather than compromising

### Schema Management Strategy

**Single Source of Truth**: Prisma schema file will be the authoritative schema definition

**Migration Flow:**

1. Update Prisma schema
2. Generate Prisma migration
3. Apply migration to database
4. Regenerate SQLAlchemy models from database (using introspection tools)

### Implementation Plan

- Phase 1: Core Schema Setup

- Phase 2: Python Integration

- Phase 3: Schema Synchronization Tools
  - Create scripts to generate SQLAlchemy models from Prisma migrations
  - Set up CI checks to ensure schema consistency
  - Document the migration process for team members

## Consequences

### Positive

- **Optimal Developer Experience**: Each service uses the best available tools
- **Type Safety**: Prisma provides excellent compile-time safety for TypeScript
- **Python Ecosystem**: Full access to mature Python database libraries
- **Performance**: Each ORM is optimized for its language
- **Flexibility**: Can optimize queries differently in each service

### Negative

- **Complexity**: Two ORM systems to maintain and understand
- **Schema Drift Risk**: Potential for schemas to get out of sync
- **Learning Curve**: Team needs familiarity with both systems
- **Tooling**: Need to maintain synchronization scripts

### Mitigation Strategies

- **Automated Testing**: Integration tests to verify schema consistency
- **Clear Documentation**: Detailed migration procedures and examples
- **CI/CD Checks**: Automated verification of schema synchronization

## Alternative Consideration

### If Complexity is a Concern

**Fallback Option**: Prisma for TypeScript and raw SQL with connection pooling for Python services. This reduces ORM complexity whilst maintaining type safety where it's most valuable.

## Follow-up Decisions Required

- ADR-004: File storage strategy (local vs cloud)
- ADR-005: Authentication and authorization approach
- ADR-006: Deployment and hosting strategy
- ADR-007: API design patterns and versioning
- ADR-008: Error handling and logging strategy
