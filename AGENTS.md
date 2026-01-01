# AGENTS.md - Guidelines for Agentic Coding in InnerScript

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing
No test framework is currently configured. When adding tests, ensure they run with a standard command and add it here.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript (no TypeScript)
- **Database:** PostgreSQL via Sequelize ORM
- **UI:** shadcn/ui components, Tailwind CSS
- **State:** React Context, TanStack React Query
- **Editor:** TipTap for rich text editing
- **Icons:** lucide-react

## Code Style Guidelines

### File Extensions
- Use `.jsx` for React components
- Use `.js` for utilities, hooks, API routes, and non-React code

### Import Order
1. React imports (`import { useState } from "react"`)
2. Third-party library imports
3. Internal imports (use `@/` alias configured in components.json)
4. Relative imports (last, if needed)

### Component Guidelines
- Add `'use client'` directive at the top of client components
- Use named exports: `export function ComponentName() {}`
- Destructure props in function parameters
- Prefer shadcn/ui components from `@/components/ui` over custom UI

### Styling
- Use Tailwind CSS for all styling
- Use `cn()` utility from `@/lib/utils` for conditional classes (combines clsx and tailwind-merge)
- Use class-variance-authority (cva) for component variants
- Prefer semantic HTML elements

### State Management
- Use React hooks for local state (useState, useEffect, useCallback, useMemo)
- Use React Query (@tanstack/react-query) for server state and mutations
- Use Context API for global app state (see app/_components/files-context.jsx)
- Use TipTap hooks for editor state

### Database Models
- Define models in `lib/db/models/[Name].model.js`
- Export factory functions that accept sequelize instance
- Initialize models in `lib/db/index.js`
- Configure associations in `lib/db/index.js` with proper cascade options

### API Routes
- Use Next.js App Router API routes in `api/` directory
- Return proper HTTP status codes
- Include error handling with try-catch blocks
- Validate input with Zod schemas (zod is installed)

### Error Handling
- Check response.ok before parsing JSON
- Throw descriptive Error objects for API failures
- Use try-catch for async operations
- Handle loading and error states in React Query

### Naming Conventions
- Components: PascalCase (`PlainEditor`, `AppSidebar`)
- Hooks: camelCase with `use` prefix (`useContextMenuDialog`)
- Utilities: camelCase (`cn`, `fetchNoteById`)
- Context hooks: `use[ContextName]Context` (e.g., `useActiveTabContext`)
- Constants: SCREAMING_SNAKE_CASE (`EMPTY_STATE_HTML`)
- Database models: PascalCase (`Note`, `Folder`)
- Model exports: camelCase lowercase (`notes`, `folders`)

### Folder Structure
- `app/` - Next.js App Router pages and layouts
- `app/_components/` - App-specific components
- `components/` - Reusable UI components
- `components/ui/` - shadcn/ui base components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and shared code
- `lib/db/` - Database models and configuration
- `api/` - API routes

### Dependencies
This project uses:
- shadcn/ui components (@radix-ui/* primitives)
- Tailwind CSS v4
- Sequelize for ORM
- Zod for validation
- TipTap for rich text editing

Before adding new dependencies:
1. Check if the codebase already uses a similar library
2. Prefer existing libraries already in package.json

### Environment
- Use `.env.example` as a template
- Required: `DATABASE_URL` for PostgreSQL connection
- Never commit `.env` files or secrets

### Commit Guidelines
- Never commit unless explicitly requested by the user
- Run `npm run lint` before committing
- Follow conventional commit format if specified

### When Working on This Codebase
1. Always read existing files to understand patterns before making changes
2. Follow the existing component structure and patterns
3. Use the `cn()` utility for merging Tailwind classes
4. Prefer React Query for data fetching and caching
5. Ensure proper cleanup in useEffect (return cleanup function)
6. Handle loading, error, and empty states in UI components
