# ADR-002: Specific Framework Choices

## Status

Accepted

## Context

Following ADR-001's decision on the hybrid technology stack, we need to select specific frameworks and libraries for each component of the system. The choices must support:

- High-throughput file uploads (potentially large 3D model files)
- Real-time status updates for queue position and print progress
- Integration with external services (Discord, Raspberry Pi controllers)
- TypeScript support with excellent developer experience
- Easy testing and debugging capabilities

## Decision Drivers

1. **Performance**: Handle concurrent file uploads and status queries efficiently
2. **TypeScript Integration**: First-class TypeScript support with strong typing
3. **Ecosystem Maturity**: Stable, well-maintained libraries with good documentation
4. **Developer Experience**: Good debugging tools, hot reload, clear error messages
5. **Learning Curve**: Reasonable complexity for team members with varying experience
6. **File Handling**: Robust multipart/form-data processing for large files
7. **WebSocket Support**: Real-time updates for queue status and print progress
8. **Testing**: Good testing framework integration

## Framework Options Analyzed

### API Framework (Node.js + TypeScript)

#### **Option A: Express.js + TypeScript**

**Pros:**

- Most widely used Node.js framework (large community)
- Extensive middleware ecosystem
- Mature TypeScript integration with @types/express
- Well-documented patterns for file uploads (multer)
- Easy WebSocket integration with socket.io

**Cons:**

- Slower performance compared to modern alternatives
- Callback-heavy patterns (though async/await helps)
- Manual setup required for many features
- Larger bundle size

#### Option B: Fastify + TypeScript

**Pros:**

- 2x faster than Express in benchmarks
- Built-in schema validation with JSON Schema
- Native TypeScript support (better than Express)
- Modern async/await patterns throughout
- Built-in logging and serialization
- Excellent plugin ecosystem
- Better error handling out of the box

**Cons:**

- Smaller community than Express
- Not as common in industry as Express
- Fewer tutorials and Stack Overflow answers
- Plugin-based architecture requires understanding

#### Option C: NestJS (Express/Fastify wrapper)

**Pros:**

- Excellent TypeScript integration with decorators
- Built in dependency injection
- Modular architecture enforces good practices
- Great for larger, complex applications
- Built in validation, guards, interceptors

**Cons:**

- Significant learning curve (Angular-like patterns)
- More complex for simple APIs
- Overhead for a project of this size
- Opinionated framework that may be overkill

### Queue Management (Python)

#### Option A: Celery + Redis

**Pros:**

- Industry standard for Python task queues
- Mature, battle-tested in production
- Excellent monitoring tools (Flower)
- Supports complex workflows and priorities
- Great documentation and community

**Cons:**

- Can be complex to set up initially
- Redis dependency (additional infrastructure)

#### Option B: RQ (Redis Queue)

**Pros:**

- Simpler than Celery
- Better for smaller projects
- Easy to understand and debug
- Python-native (no separate broker needed beyond Redis)

**Cons:**

- Less feature rich than Celery
- Fewer advanced scheduling options
- Smaller community

### Discord Bot (Python)

#### Option A: discord.py

**Pros:**

- Most mature Python Discord library
- Fine async support
- Comprehensive API coverage
- Great documentation and examples

**Cons:**

- Development was discontinued briefly (though now resumed)

#### Option B: disnake (discord.py fork)

**Pros:**

- Active development during discord.py hiatus
- Modern async patterns
- Good slash command support

**Cons:**

- Smaller community
- Less documentation

## Decisions

### API Framework: **Fastify + TypeScript**

**Rationale:**

1. **Performance**: File uploads will benefit from Fastify's superior performance
2. **TypeScript Integration**: Native TypeScript support provides better developer experience than Express
3. **Modern Patterns**: Async/await throughout reduces callback complexity
4. **Schema Validation**: Built-in JSON Schema validation reduces boilerplate
5. **Future-Proof**: Modern architecture that will scale with the project

### Queue Management: **Celery + Redis**

**Rationale:**

1. **Priority Requirements**: Supports possibly complex priority system (school vs personal, retry logic)
2. **Monitoring**: Flower provides excellent queue monitoring for debugging
3. **Scalability**: Can easily scale to multiple workers as the innovation lab grows
4. **Reliability**: Battle tested in production environments

### Discord Bot: **discord.py**

**Rationale:**

1. **Maturity**: Most comprehensive Python Discord library
2. **Documentation**: Excellent documentation and community resources
3. **Feature Set**: Complete API coverage for current and future Discord features

## Implementation Plan

- Phase 1: API Setup
- Phase 2: Queue Integration
- Phase 3: Discord Bot

## Consequences

### Positive

- **Performance**: Fastify's speed benefits file upload handling
- **Type Safety**: Better TypeScript integration across the API
- **Reliability**: Proven queue management with Celery
- **Maintainability**: Schema validation reduces runtime errors

### Negative

- **Learning Curve**: Coders need to learn Fastify patterns
- **Infrastructure**: Redis adds another service to manage
- **Complexity**: Celery setup is more involved than simpler alternatives

### Mitigation Strategies

- **Documentation**: Create detailed setup and usage guides
- **Examples**: Provide working examples for common patterns
- **Docker**: Containerized development environment to simplify Redis setup

## Specific Libraries and Versions

```json
// API (package.json)
{
  "fastify": "^4.24.0",
  "@fastify/multipart": "^8.0.0",
  "@fastify/cors": "^9.0.0",
  "@fastify/swagger": "^8.12.0",
  "typescript": "^5.2.0"
}
```

```txt
# Queue Management (requirements.txt)
celery==5.3.4
redis==5.0.1
flower==2.0.1
```

```txt
# Discord Bot (requirements.txt)
discord.py==2.3.2
aiohttp==3.9.1
```

## Follow-up Decisions Required

- ADR-003: Database ORM/Query Builder selection (Prisma vs TypeORM vs raw SQL)
- ADR-004: File storage strategy (local vs cloud)
- ADR-005: Authentication and authorization approach
- ADR-006: Deployment and containerization strategy
