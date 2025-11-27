# ADR 004 - Use Next.js 15 App Router Architecture

## Status
Accepted

## Context
We needed a modern React framework that supports:
- Server-side rendering for performance
- API routes for backend functionality
- Server Components for reduced client bundle size
- File-based routing for intuitive structure
- React 19 support for latest features

## Considered Alternatives

### 1. Next.js Pages Router
- **Pros**: Mature, stable, extensive documentation
- **Cons**: Older architecture, larger client bundles, less efficient
- **Decision**: Not chosen - App Router is the future of Next.js

### 2. Remix
- **Pros**: Excellent data loading, form handling, nested routing
- **Cons**: Smaller ecosystem, different mental model, less adoption
- **Decision**: Not chosen - Next.js has larger ecosystem and better AI integration

### 3. Vite + React Router
- **Pros**: Fast dev server, flexible routing
- **Cons**: No built-in API routes, need separate backend, more setup
- **Decision**: Not chosen - need integrated API routes

### 4. Next.js App Router (Current)
- **Pros**: Latest Next.js features, Server Components, integrated API routes, React 19
- **Cons**: Newer (less documentation), some breaking changes from Pages Router
- **Decision**: **Chosen** - best balance of features and ecosystem

## Decision
We use **Next.js 15 with App Router** because:

1. **Server Components**: Reduce client bundle size, better performance
2. **Integrated API Routes**: No need for separate backend server
3. **File-based Routing**: Intuitive structure (`app/Journal/page.jsx`)
4. **Server Actions**: Type-safe server functions (`'use server'` directive)
5. **React 19 Support**: Latest React features and performance improvements
6. **Turbopack**: Faster dev server (via `--turbopack` flag)

### Architecture Pattern
- **Pages**: `app/Journal/page.jsx` - Server Component that fetches data
- **API Routes**: `app/api/*/route.js` - REST endpoints
- **Server Actions**: `app/Journal/action.js` - Server-side functions
- **Client Components**: `app/_components/*.jsx` - Interactive UI (marked with `'use client'`)

## Consequences

### Positive
- ✅ Smaller client bundles (Server Components not sent to client)
- ✅ Better SEO (server-rendered content)
- ✅ Integrated backend (no separate API server)
- ✅ Type-safe server functions (Server Actions)
- ✅ Fast development with Turbopack
- ✅ React 19 features (use hook, improved concurrent rendering)

### Negative
- ⚠️ Learning curve for team members new to App Router
- ⚠️ Some libraries not yet compatible with Server Components
- ⚠️ Need to be explicit about client vs server components
- ⚠️ Less documentation compared to Pages Router

### Migration Notes
- Current structure uses App Router conventions
- Server Components used for data fetching (`getExplorerData()`)
- Client Components for interactive UI (editor, sidebar, dialogs)
- API routes follow REST conventions

### Best Practices Applied
1. **Server Components by default**: Only use `'use client'` when needed
2. **Colocation**: Components, actions, and routes in same directory structure
3. **Data Fetching**: Server Components fetch data, pass to Client Components
4. **API Routes**: Used for external integrations (OpenAI) and complex operations

### Future Considerations
- Consider React Server Components for more data fetching
- Evaluate streaming for large data sets
- Consider route groups for better organization
- Evaluate middleware for authentication (if needed)

