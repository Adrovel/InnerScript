# Day 1 Ramp Up Plan - InnerScript

Welcome to InnerScript! This guide will get you up and running in under 10 minutes.

## Prerequisites

- **Node.js**: Version 22.x (check with `node --version`)
- **Docker & Docker Compose**: Required for local database setup
- **Git**: For cloning the repository
- **OpenAI API Key**: Required for AI chat features (get from https://platform.openai.com/api-keys)

## Quick Start (Under 10 Minutes)

### Step 1: Clone and Navigate (30 seconds)
```bash
git clone <repository-url>
cd InnerScript
```

### Step 2: Install Dependencies (2 minutes)
```bash
npm install
```

### Step 3: Set Up Environment Variables (1 minute)
Create a `.env.local` file in the root directory:
```bash
cat > .env.local << EOF
DATABASE_URL=postgresql://postgres:InnerScript123#@localhost:5432/innerscript
OPENAI_API_KEY=your_openai_api_key_here
EOF
```

**Important**: Replace `your_openai_api_key_here` with your actual OpenAI API key.

### Step 4: Start Docker Services (2 minutes)
```bash
docker compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Next.js application (will start after DB is healthy)

Wait for the database to be ready (check with `docker compose ps` - db should show "healthy").

### Step 5: Initialize Database Schema (1 minute)

The database tables are created automatically via Sequelize models on first connection. However, if you need to manually sync:

```bash
# Connect to the database container
docker compose exec db psql -U postgres -d innerscript

# In the psql prompt, enable pgvector extension (if not already enabled):
CREATE EXTENSION IF NOT EXISTS vector;

# Exit psql
\q
```

### Step 6: Start Development Server (30 seconds)
```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### Step 7: Verify Everything Works (2 minutes)

1. Open http://localhost:3000 in your browser
2. Click "Journal" link to navigate to the main app
3. Right-click in the sidebar to create a new note or folder
4. Select a note to edit it
5. Verify the editor loads and you can type

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker compose ps

# View database logs
docker compose logs db

# Restart database
docker compose restart db
```

### Port Already in Use
If port 3000 is taken:
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or change port in package.json dev script to use a different port
```

### Missing Dependencies
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Schema Not Created
```bash
# The schema should auto-create, but if needed:
docker compose exec app npm run dev
# The Sequelize models will sync on first connection
```

## What to Explore Next

1. **Architecture**: Read `docs/architecture.md` to understand system design
2. **ADRs**: Check `docs/adr/` for major technical decisions
3. **Key Files**:
   - `app/Journal/page.jsx` - Main journal page
   - `app/_components/app-sidebar.jsx` - Sidebar component
   - `app/_components/plain-editor.jsx` - Rich text editor
   - `app/api/` - REST API endpoints
   - `lib/db/` - Database models and queries

## Development Workflow

### Building for Production
```bash
npm run build
npm start
```

### Database Migrations
Currently using Sequelize `sync()` in development. For production, use proper migrations (see ADR-002).

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `OPENAI_API_KEY` | Yes | OpenAI API key for chat features | `sk-...` |

## Common Commands Cheat Sheet

```bash
# Start everything
docker compose up -d && npm run dev

# Stop everything
docker compose down

# View logs
docker compose logs -f app
docker compose logs -f db

# Rebuild containers
docker compose up -d --build

# Access database shell
docker compose exec db psql -U postgres -d innerscript

# Clean restart (nuclear option)
docker compose down -v && docker compose up -d && npm run dev
```

## Next Steps After Setup

1. ✅ Verify you can create/edit/delete notes
2. ✅ Test the context menu (right-click) functionality
3. ✅ Explore the codebase structure
4. ✅ Read architecture documentation
5. ✅ Review ADRs for design decisions

## Getting Help

- Check `docs/architecture.md` for system overview
- Review `docs/adr/` for design decisions
- Check inline code comments for implementation details
- Review `docs/Docker.md` for Docker-specific questions

---