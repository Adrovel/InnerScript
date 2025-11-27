# ADR 005 - State Management Strategy (React Context + React Query)

## Status
Accepted

## Context
We needed state management for:
- Global UI state (selected note, sidebar metadata)
- Server state caching (note data, tree structure)
- Optimistic updates for better UX
- Cache invalidation on mutations

## Considered Alternatives

### 1. Redux / Zustand
- **Pros**: Predictable state management, dev tools, time-travel debugging
- **Cons**: Boilerplate, overkill for our use case, need separate caching solution
- **Decision**: Not chosen - too much boilerplate for our needs

### 2. React Query Only
- **Pros**: Excellent server state management, caching, refetching
- **Cons**: No good solution for client-only state (selected note)
- **Decision**: Not chosen - need client state management too

### 3. React Context Only
- **Pros**: Built-in, simple, no dependencies
- **Cons**: No caching, manual refetching, performance concerns with frequent updates
- **Decision**: Not chosen - need server state caching

### 4. React Context + React Query (Current)
- **Pros**: Context for client state, React Query for server state, best of both
- **Cons**: Two state management systems to understand
- **Decision**: **Chosen** - optimal for our use case

## Decision
We use a **hybrid approach**:

1. **React Context** (`files-context.jsx`): 
   - Client-only state: selected note ID, sidebar metadata
   - Simple, no caching needed
   - Lightweight for UI state

2. **React Query** (`@tanstack/react-query`):
   - Server state: note content, API responses
   - Automatic caching, refetching, background updates
   - Optimistic updates support
   - Stale-while-revalidate pattern

### Implementation Details
- **Context Providers**: `FileProvider` wraps app, provides `sidebarMetadata` and `selectedNoteId`
- **React Query**: Configured with 1-minute stale time, 1 retry
- **Query Keys**: `['note', noteId]` for note queries
- **Cache Strategy**: Stale-while-revalidate (show cached data, fetch in background)

## Consequences

### Positive
- ✅ Right tool for the job (Context for UI, Query for server)
- ✅ Automatic caching reduces API calls
- ✅ Optimistic updates possible (not yet implemented)
- ✅ Background refetching keeps data fresh
- ✅ Simple API for common use cases

### Negative
- ⚠️ Two systems to understand and maintain
- ⚠️ Need to coordinate between Context and Query (e.g., invalidate cache on mutations)
- ⚠️ React Query cache not persisted (lost on page refresh)
- ⚠️ No automatic cache invalidation on note updates (manual invalidation needed)

### Current Gaps
1. **Cache Invalidation**: Not automatically invalidated when notes/folders are created/updated
2. **Optimistic Updates**: Not implemented for create/update/delete operations
3. **Error Handling**: Basic error handling, could be improved
4. **Loading States**: Handled per-component, could be centralized

### Future Improvements
1. **Cache Invalidation**: Add `queryClient.invalidateQueries()` after mutations
2. **Optimistic Updates**: Use `useMutation` with optimistic updates for better UX
3. **Persistent Cache**: Consider `@tanstack/react-query-persist-client` for offline support
4. **Error Boundaries**: Add error boundaries for better error handling
5. **Suspense**: Use React Suspense with React Query for better loading states

### Migration Notes
- Current: Basic setup with default options
- Future: Add mutation hooks with cache invalidation
- Consider: Moving to React Query v5 patterns (if not already)

