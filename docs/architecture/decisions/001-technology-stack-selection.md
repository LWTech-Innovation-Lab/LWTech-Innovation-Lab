# ADR-001: Technology Stack Selection

## Status

Proposed

## Context

The Innovation Lab Print Management System requires a technology stack that supports:

- Remote file uploads and queue management
- Integration with Discord for notifications
- Control of physical devices via Raspberry Pi controllers
- Scalable web interface for students and staff
- Easy maintenance by programmers of varying skill levels

## Decision Drivers

1. **Type Safety**: Reduces bugs and improves maintainability in a multi-developer environment
2. **Queue Management**: Requires robust, mature libraries for priority-based job scheduling
3. **Raspberry Pi Integration**: Need seamless communication with device controllers
4. **Developer Experience**: Balance between productivity and learning curve
5. **Deployment Simplicity**: Easy hosting and continuous deployment
6. **Library Ecosystem**: Access to mature, well-maintained libraries
7. **Team Scalability**: Code should be readable and maintainable by programmers of all levels

## Options Considered

### Option A: Full JavaScript/TypeScript Stack

- **Frontend**: React + TypeScript + Tailwind + Next.js
- **Backend**: Node.js + TypeScript + Express
- **Queue**: Node.js with Bull/BullMQ
- **Discord Bot**: discord.js (TypeScript)
- **Database**: PostgreSQL

**Pros:**

- Unified language across the entire stack
- Shared types between frontend and backend
- Consistent tooling and deployment
- Strong type safety throughout

**Cons:**

- Queue management libraries are less mature than Python equivalents
- Raspberry Pi ecosystem is primarily Python-based
- Discord bot libraries are less feature-complete than Python alternatives

### Option B: Hybrid Stack (Recommended)

- **Frontend**: React + TypeScript + Tailwind + Next.js
- **API**: Node.js + TypeScript + Express/Fastify
- **Queue Management**: Python + Celery + Redis
- **Discord Bot**: Python + discord.py
- **Device Controllers**: Python (Raspberry Pi)
- **Database**: PostgreSQL

**Pros:**

- Type safety where it matters most (frontend/API boundary)
- Mature queue management with Celery + Redis
- Excellent Raspberry Pi integration with Python
- discord.py is the most mature Discord bot framework
- Best-tool-for-job approach

**Cons:**

- Multiple programming languages in the stack
- No shared types between frontend and Python services
- Slightly more complex deployment

### Option C: Full Python Stack

- **Frontend**: React + TypeScript + Tailwind + Next.js
- **Backend**: FastAPI + Python
- **Queue**: Python + Celery + Redis
- **Discord Bot**: Python + discord.py
- **Database**: PostgreSQL

**Pros:**

- Python services can share code
- Excellent for data processing and device integration
- Unified backend language

**Cons:**

- No shared types between frontend and backend
- FastAPI ecosystem smaller than Node.js for web development
- TypeScript frontend developers would need Python knowledge for backend work

## Decision

The recommended option is **Option B: Hybrid Stack** for the following reasons:

1. **Critical Infrastructure Requirements**: Queue management and device control are core to our system's success. Python's mature ecosystem (Celery, asyncio, GPIO libraries) provides the most reliable foundation.

2. **Type Safety Where It Counts**: TypeScript for frontend and API provides type safety at the most error-prone boundary (UI/backend communication) whilst allowing Python's strengths for infrastructure.

3. **Raspberry Pi Ecosystem**: Python is the de facto standard for Raspberry Pi development, with extensive hardware libraries and community support.

4. **Discord Integration**: discord.py offers more features and better documentation than JavaScript alternatives.

5. **Scalable Architecture**: Separating concerns allows different teams to work on different services with appropriate tools.

## Implementation Strategy

### Phase 1: Core Infrastructure

- Set up PostgreSQL database
- Implement Python queue management service with Celery
- Create basic Raspberry Pi controller framework

### Phase 2: API and Frontend

- Build TypeScript API with well-defined interfaces
- Develop React frontend with type-safe API communication
- Implement authentication and file upload

### Phase 3: Integration

- Connect Discord bot to queue system
- Integrate device controllers with queue management
- Add monitoring and notification systems

## Consequences

### Positive

- **Robust Infrastructure**: Mature Python libraries ensure reliable queue and device management
- **Developer Productivity**: TypeScript provides excellent developer experience for web development
- **Maintainability**: Clear separation of concerns makes the system easier to understand and modify
- **Flexibility**: Can optimize each service with the best available tools

### Negative

- **Context Switching**: Developers need familiarity with both TypeScript and Python
- **Deployment Complexity**: Multiple runtime environments require more sophisticated deployment
- **Type Safety Gap**: No compile-time type checking between frontend and Python services

### Mitigation Strategies

- **Documentation**: Comprehensive API documentation with OpenAPI/Swagger
- **Testing**: Integration tests to catch type mismatches between services
- **Team Structure**: Assign team members to specific services based on their strengths
- **Shared Standards**: Consistent code formatting and linting across all languages

## Alternatives Considered But Rejected

- **Java/C++**: Too verbose and complex for rapid development
- **Pure Python Frontend**: Would sacrifice type safety and modern web development practices
- **Microservices in Different Languages**: Would add unnecessary complexity for a project of this size

## Follow-up Decisions Required

- ADR-002: Specific framework choices (Express vs Fastify, etc.)
- ADR-003: Deployment and hosting strategy
- ADR-004: API design patterns and versioning
- ADR-005: Testing strategy across multiple languages
